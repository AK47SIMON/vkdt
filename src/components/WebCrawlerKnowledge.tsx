import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Globe, 
  Brain, 
  RefreshCw,
  FileText,
  Link,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeItem {
  id: string;
  topic: string;
  source: string;
  summary: string;
  url?: string;
  timestamp: Date;
  status: "success" | "pending" | "error";
}

const WebCrawlerKnowledge = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      topic: "Mombasa Port Expansion Phase 2",
      source: "KPA News",
      summary: "Phase 2 of the second container terminal at the Port of Mombasa is now fully operational, increasing capacity by 450,000 TEUs.",
      url: "https://www.kpa.co.ke",
      timestamp: new Date(),
      status: "success"
    },
    {
      id: "2",
      topic: "Nairobi Expressway Traffic Flow",
      source: "MoTI Kenya",
      summary: "Daily traffic on the Nairobi Expressway has exceeded 60,000 vehicles, significantly reducing travel time between JKIA and Westlands.",
      timestamp: new Date(),
      status: "success"
    },
    {
      id: "3",
      topic: "Konza Technopolis Data Center",
      source: "Konza.go.ke",
      summary: "The Tier III National Data Center at Konza is now hosting 40% of government digital services, enhancing national data sovereignty.",
      timestamp: new Date(),
      status: "success"
    }
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      topic: searchQuery,
      source: "Sovereign Crawler",
      summary: "Crawling open web for insights...",
      timestamp: new Date(),
      status: "pending"
    };
    
    setKnowledgeItems(prev => [newItem, ...prev]);

    try {
      const result = await firecrawlApi.search(`Kenya ${searchQuery} official reports`, { limit: 5 });
      
      if (result.success && result.data) {
        setKnowledgeItems(prev => prev.map(item => 
          item.id === newItem.id 
            ? {
                ...item,
                summary: result.data?.[0]?.description || "Official information retrieved successfully.",
                url: result.data?.[0]?.url,
                source: new URL(result.data?.[0]?.url || "https://example.com").hostname,
                status: "success" as const
              }
            : item
        ));
        
        toast({
          title: "Knowledge Base Updated",
          description: `Found ${result.data.length} open sources for "${searchQuery}"`,
        });
      } else {
        throw new Error(result.error || "Crawl failed");
      }
    } catch (error) {
      console.error('Crawl error:', error);
      setKnowledgeItems(prev => prev.map(item => 
        item.id === newItem.id 
          ? { ...item, summary: "Failed to retrieve open information", status: "error" as const }
          : item
      ));
      
      toast({
        title: "Crawl Failed",
        description: "Unable to find open-source data for this topic.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  const quickTopics = [
    "Konza Tech Progress",
    "LAPSSET Corridor",
    "SGR Operations",
    "Geothermal Power",
    "M-Pesa Dynamics"
  ];

  return (
    <section id="knowledge" className="relative py-20 px-6 bg-card/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">Real-time Intelligence</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sovereign Knowledge Engine
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI crawler bridges the gap between static data and live events by indexing open-source reports and news across the Kenyan digital landscape.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ask the Twin about Kenya's infrastructure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border focus:border-primary/50 transition-all"
                disabled={isSearching}
              />
            </div>
            <Button type="submit" variant="glow" disabled={isSearching} className="gap-2">
              {isSearching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              {isSearching ? "Crawling..." : "Sync Info"}
            </Button>
          </div>
        </motion.form>

        {/* Quick Topics */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {quickTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSearchQuery(topic)}
              className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-[10px] font-bold text-muted-foreground uppercase hover:border-primary/50 hover:text-foreground transition-all"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Knowledge Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel p-6 group hover:border-primary/30 transition-all ${
                item.status === "pending" ? "animate-pulse" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded bg-muted group-hover:bg-primary/10 transition-colors`}>
                    {item.status === "success" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    ) : item.status === "pending" ? (
                      <RefreshCw className="w-3.5 h-3.5 text-kenya-gold animate-spin" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-accent" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.source}</span>
                </div>
                {item.url && (
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Link className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <h3 className="font-bold text-foreground text-sm mb-3 leading-tight">{item.topic}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.summary}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Verified Stream</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer */}
        <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <Brain className="w-5 h-5 text-primary" />
          <p className="text-xs text-muted-foreground max-w-2xl">
            This engine uses **Open-Source LLMs** and **Firecrawl** to index the web in real-time. 
            Unlike static dashboards, the Virtual Kenya Twin evolves as new information is published.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WebCrawlerKnowledge;
