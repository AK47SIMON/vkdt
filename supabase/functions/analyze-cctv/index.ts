import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Detection {
  type: string;
  count: number;
  confidence: number;
}

interface AnalysisRequest {
  feedId: string;
  feedName: string;
  location: string;
  currentDetections: Detection[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedId, feedName, location, currentDetections }: AnalysisRequest = await req.json();

    console.log(`Analyzing CCTV feed: ${feedName} at ${location}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create analysis prompt based on detection data
    const detectionSummary = currentDetections
      .map((d) => `${d.count} ${d.type}s (${(d.confidence * 100).toFixed(0)}% confidence)`)
      .join(", ");

    const systemPrompt = `You are an AI traffic and crowd analysis expert for the Virtual Kenya Digital Twin platform. 
    You analyze CCTV feed data to provide insights about traffic patterns, crowd density, and safety observations.
    Keep responses concise (2-3 sentences) and actionable. Focus on:
    - Traffic flow analysis
    - Crowd density patterns
    - Safety observations
    - Recommendations for city planners`;

    const userPrompt = `Analyze this CCTV feed data:
    - Camera: ${feedName}
    - Location: ${location}
    - Current Detections: ${detectionSummary || "No detections"}
    
    Provide a brief analysis of the current scene and any notable patterns or concerns.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices?.[0]?.message?.content || "Unable to generate analysis.";

    console.log(`Analysis complete for ${feedName}`);

    return new Response(
      JSON.stringify({
        feedId,
        feedName,
        location,
        analysis,
        timestamp: new Date().toISOString(),
        detections: currentDetections,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-cctv function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
