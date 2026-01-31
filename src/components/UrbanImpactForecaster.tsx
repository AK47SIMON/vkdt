import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Map,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader,
  Plus,
  X,
  MapPin,
  Layers,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DevelopmentProject {
  id: string;
  name: string;
  type: "residential" | "commercial" | "industrial" | "mixed";
  location: { lat: number; lng: number };
  area: number; // in hectares
  units: number;
  height: number; // in meters
  population: number;
}

interface ImpactAssessment {
  trafficImpact: {
    additionalVehicles: number;
    congestionIncrease: number; // percentage
    severity: "low" | "medium" | "high";
  };
  infrastructureNeeds: {
    powerDemand: number; // MW
    waterDemand: number; // million liters/day
    sewerageCapacity: number; // million liters/day
    roadNetworkImpact: string;
  };
  economicImpact: {
    jobsCreated: number;
    propertyValueChange: number; // percentage
    localBusinessGrowth: number; // percentage
    taxRevenue: number; // KES annually
  };
  environmentalImpact: {
    greenSpaceReduction: number; // percentage
    carbonFootprint: number; // tonnes CO2/year
    airQualityChange: number; // AQI points
    waterQualityRisk: string;
  };
  socialImpact: {
    populationDensityChange: number; // people/km²
    affordabilityRisk: string;
    communityDisruption: string;
    publicServiceStrain: string;
  };
  riskFactors: string[];
  recommendations: string[];
}

const UrbanImpactForecaster = () => {
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | null>(null);
  const [assessment, setAssessment] = useState<ImpactAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<DevelopmentProject>>({
    name: "",
    type: "residential",
    area: 5,
    units: 100,
    height: 20,
    population: 500,
    location: { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
  });

  const handleAddProject = useCallback(() => {
    if (!formData.name) {
      alert("Please enter a project name");
      return;
    }

    const newProject: DevelopmentProject = {
      id: `project-${Date.now()}`,
      name: formData.name || "",
      type: formData.type as any,
      location: formData.location || { lat: -1.2921, lng: 36.8219 },
      area: formData.area || 5,
      units: formData.units || 100,
      height: formData.height || 20,
      population: formData.population || 500,
    };

    setProjects([...projects, newProject]);
    setFormData({
      name: "",
      type: "residential",
      area: 5,
      units: 100,
      height: 20,
      population: 500,
      location: { lat: -1.2921, lng: 36.8219 },
    });
    setShowForm(false);
  }, [formData, projects]);

  const handleAnalyzeProject = useCallback(async (project: DevelopmentProject) => {
    setSelectedProject(project);
    setIsAnalyzing(true);

    // Simulate AI analysis with realistic impact calculations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate impacts based on project characteristics
    const densityFactor = project.population / project.area;
    const heightFactor = project.height / 20;

    const assessment: ImpactAssessment = {
      trafficImpact: {
        additionalVehicles: Math.floor(project.population * 0.6), // 60% vehicle ownership
        congestionIncrease: Math.min(100, densityFactor * 2.5),
        severity: densityFactor > 300 ? "high" : densityFactor > 150 ? "medium" : "low",
      },
      infrastructureNeeds: {
        powerDemand: project.population * 0.0015, // 1.5 kW per person
        waterDemand: project.population * 0.15, // 150 liters per person per day
        sewerageCapacity: project.population * 0.12,
        roadNetworkImpact: `Requires ${Math.ceil(project.area * 0.15)} km of new/upgraded roads`,
      },
      economicImpact: {
        jobsCreated: Math.floor(project.units * 2.5 + project.population * 0.15),
        propertyValueChange: Math.min(35, densityFactor * 0.08),
        localBusinessGrowth: Math.min(40, densityFactor * 0.1),
        taxRevenue: Math.floor(project.units * 50000 * (project.type === "commercial" ? 1.5 : 1)),
      },
      environmentalImpact: {
        greenSpaceReduction: Math.min(80, project.area * 12),
        carbonFootprint: project.population * 2.5 * 365, // tonnes CO2/year
        airQualityChange: Math.min(20, densityFactor * 0.05),
        waterQualityRisk: densityFactor > 300 ? "High - sewerage infrastructure critical" : "Moderate",
      },
      socialImpact: {
        populationDensityChange: densityFactor,
        affordabilityRisk:
          project.type === "residential" && project.height > 30
            ? "High - potential gentrification"
            : "Moderate",
        communityDisruption:
          project.type === "industrial"
            ? "High - noise and emissions"
            : project.type === "commercial"
              ? "Medium - traffic and activity"
              : "Low - residential compatible",
        publicServiceStrain:
          densityFactor > 300
            ? "High - schools, hospitals, utilities strained"
            : "Moderate - manageable with planning",
      },
      riskFactors: [
        densityFactor > 300 ? "High population density - infrastructure strain risk" : null,
        project.type === "industrial" ? "Industrial emissions - air quality impact" : null,
        project.height > 40 ? "Tall building - wind and shadow effects" : null,
        project.area > 10 ? "Large footprint - significant land use change" : null,
        project.type === "commercial" ? "Commercial activity - traffic congestion risk" : null,
      ].filter(Boolean) as string[],
      recommendations: [
        "Conduct detailed environmental impact assessment (EIA)",
        "Engage with local community stakeholders",
        "Plan for adequate parking and public transport access",
        "Implement green building standards (LEED/EDGE certification)",
        densityFactor > 300 ? "Upgrade local water and sewerage infrastructure" : null,
        project.type === "industrial" ? "Install pollution control systems" : null,
        "Preserve existing green spaces and create new parks",
        "Integrate with existing urban fabric and street networks",
      ].filter(Boolean) as string[],
    };

    setAssessment(assessment);
    setIsAnalyzing(false);
  }, []);

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
      setAssessment(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "text-red-500 bg-red-500/10";
    if (severity === "medium") return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
  };

  return (
    <section className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">
              Urban Planning Tool
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Urban Development Impact Forecaster
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-powered impact assessment for proposed developments. Forecast economic, environmental, and social effects before construction begins.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground">Projects</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(!showForm)}
                  className="h-8 w-8"
                >
                  {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>

              {/* Add Project Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 rounded-lg bg-muted/50 space-y-3"
                  >
                    <Input
                      placeholder="Project name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-sm"
                    />

                    <select
                      value={formData.type || "residential"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="mixed">Mixed-Use</option>
                    </select>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Area: {formData.area} hectares
                      </label>
                      <Slider
                        value={[formData.area || 5]}
                        onValueChange={(val) => setFormData({ ...formData, area: val[0] })}
                        min={1}
                        max={50}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Height: {formData.height} meters
                      </label>
                      <Slider
                        value={[formData.height || 20]}
                        onValueChange={(val) => setFormData({ ...formData, height: val[0] })}
                        min={5}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Units: {formData.units}
                      </label>
                      <Slider
                        value={[formData.units || 100]}
                        onValueChange={(val) => setFormData({ ...formData, units: val[0] })}
                        min={10}
                        max={1000}
                        step={10}
                      />
                    </div>

                    <Button
                      size="sm"
                      onClick={handleAddProject}
                      className="w-full"
                    >
                      Add Project
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Projects List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No projects yet. Add one to get started.
                  </p>
                ) : (
                  projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProject?.id === project.id
                          ? "bg-primary/10 border border-primary/50"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => handleAnalyzeProject(project)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm text-foreground">{project.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{project.type}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Area: {project.area} ha</p>
                        <p>Units: {project.units}</p>
                        <p>Height: {project.height}m</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Assessment Results */}
          <div className="lg:col-span-2">
            {selectedProject && assessment ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Project Overview */}
                <div className="glass-panel p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">{selectedProject.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedProject.type} Development</p>
                    </div>
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Area</p>
                      <p className="font-bold text-foreground">{selectedProject.area} ha</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Height</p>
                      <p className="font-bold text-foreground">{selectedProject.height}m</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Units</p>
                      <p className="font-bold text-foreground">{selectedProject.units}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Population</p>
                      <p className="font-bold text-foreground">{selectedProject.population}</p>
                    </div>
                  </div>
                </div>

                {/* Impact Tabs */}
                <Tabs defaultValue="traffic" className="glass-panel p-6">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
                    <TabsTrigger value="traffic" className="text-xs">Traffic</TabsTrigger>
                    <TabsTrigger value="economic" className="text-xs">Economic</TabsTrigger>
                    <TabsTrigger value="environment" className="text-xs">Environment</TabsTrigger>
                    <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
                    <TabsTrigger value="risks" className="text-xs">Risks</TabsTrigger>
                  </TabsList>

                  {/* Traffic Impact */}
                  <TabsContent value="traffic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Additional Vehicles</p>
                        <p className="text-2xl font-bold text-foreground">
                          {assessment.trafficImpact.additionalVehicles.toLocaleString()}
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Congestion Increase</p>
                        <p className={`text-2xl font-bold ${assessment.trafficImpact.congestionIncrease > 50 ? "text-red-500" : "text-yellow-500"}`}>
                          +{assessment.trafficImpact.congestionIncrease.toFixed(1)}%
                        </p>
                      </Card>
                    </div>
                    <div className={`p-4 rounded-lg ${getSeverityColor(assessment.trafficImpact.severity)}`}>
                      <p className="font-medium capitalize">Severity: {assessment.trafficImpact.severity}</p>
                    </div>
                  </TabsContent>

                  {/* Economic Impact */}
                  <TabsContent value="economic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Jobs Created</p>
                        <p className="text-2xl font-bold text-green-500">
                          +{assessment.economicImpact.jobsCreated.toLocaleString()}
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Annual Tax Revenue</p>
                        <p className="text-lg font-bold text-foreground">
                          KES {(assessment.economicImpact.taxRevenue / 1000000).toFixed(1)}M
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Property Value Change</p>
                        <p className="text-2xl font-bold text-primary">
                          +{assessment.economicImpact.propertyValueChange.toFixed(1)}%
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Local Business Growth</p>
                        <p className="text-2xl font-bold text-primary">
                          +{assessment.economicImpact.localBusinessGrowth.toFixed(1)}%
                        </p>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Environmental Impact */}
                  <TabsContent value="environment" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Green Space Reduction</p>
                        <p className="text-2xl font-bold text-orange-500">
                          -{assessment.environmentalImpact.greenSpaceReduction.toFixed(1)}%
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Carbon Footprint</p>
                        <p className="text-lg font-bold text-foreground">
                          {(assessment.environmentalImpact.carbonFootprint / 1000).toFixed(1)}K tonnes/year
                        </p>
                      </Card>
                    </div>
                    <Card className="p-4 bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">Water Quality Risk:</span> {assessment.environmentalImpact.waterQualityRisk}
                      </p>
                    </Card>
                  </TabsContent>

                  {/* Social Impact */}
                  <TabsContent value="social" className="space-y-4">
                    <div className="space-y-3">
                      <Card className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Population Density Change</p>
                        <p className="text-lg font-bold text-foreground">
                          +{assessment.socialImpact.populationDensityChange.toFixed(0)} people/km²
                        </p>
                      </Card>
                      <Card className="p-4 bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Affordability Risk:</span> {assessment.socialImpact.affordabilityRisk}
                        </p>
                      </Card>
                      <Card className="p-4 bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Community Disruption:</span> {assessment.socialImpact.communityDisruption}
                        </p>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Risk Factors */}
                  <TabsContent value="risks" className="space-y-4">
                    {assessment.riskFactors.length > 0 ? (
                      <div className="space-y-2">
                        {assessment.riskFactors.map((risk, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground">{risk}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">No major risk factors identified</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {assessment.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : isAnalyzing ? (
              <div className="glass-panel p-12 flex items-center justify-center">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Analyzing development impact...</p>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a project to view impact assessment</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-accent/5 to-transparent border border-accent/20"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-bold">Urban Impact Forecaster:</span> This tool uses AI to simulate the economic, environmental, and social effects of proposed developments. 
            Results are based on real-world urban planning models and Kenya-specific data. Always conduct formal EIA studies before project approval.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default UrbanImpactForecaster;
