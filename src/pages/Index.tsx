import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MetricsDashboard from "@/components/MetricsDashboard";
import EnhancedKenyaMap from "@/components/EnhancedKenyaMap";
import CesiumGlobe from "@/components/CesiumGlobe";
import TerrainVisualization from "@/components/TerrainVisualization";
import IoTDashboard from "@/components/IoTDashboard";
import LiveDataPanel from "@/components/LiveDataPanel";
import CCTVPanel from "@/components/CCTVPanel";
import InfrastructurePanel from "@/components/InfrastructurePanel";
import EnvironmentalPanel from "@/components/EnvironmentalPanel";
import DataSourcesPanel from "@/components/DataSourcesPanel";
import SimulationEnginesPanel from "@/components/SimulationEnginesPanel";
import AIAnalyticsPanel from "@/components/AIAnalyticsPanel";
import FuelPriceSimulation from "@/components/FuelPriceSimulation";
import KenyaOpenDataAPI from "@/components/KenyaOpenDataAPI";
import WebCrawlerKnowledge from "@/components/WebCrawlerKnowledge";
import EconomicDashboard from "@/components/EconomicDashboard";
import LabLauncher from "@/components/LabLauncher";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        {/* Lab Launcher - Entry point to all features */}
        <LabLauncher />
        
        <section id="dashboard">
          <MetricsDashboard />
        </section>
        <section id="data-sources">
          <DataSourcesPanel />
        </section>
        <section id="open-data">
          <KenyaOpenDataAPI />
        </section>
        
        {/* Economic Intelligence Dashboard */}
        <section id="economic-dashboard">
          <EconomicDashboard />
        </section>
        
        <section id="globe">
          <CesiumGlobe />
        </section>
        <section id="map">
          <EnhancedKenyaMap />
        </section>
        <section id="knowledge">
          <WebCrawlerKnowledge />
        </section>
        <section id="iot">
          <IoTDashboard />
        </section>
        <section id="live-data">
          <LiveDataPanel />
        </section>
        <section id="cctv">
          <CCTVPanel />
        </section>
        <section id="simulation">
          <SimulationEnginesPanel />
        </section>
        <section id="fuel-simulation">
          <FuelPriceSimulation />
        </section>
        <section id="ai-analytics">
          <AIAnalyticsPanel />
        </section>
        <section id="terrain">
          <TerrainVisualization />
        </section>
        <section id="infrastructure">
          <InfrastructurePanel />
        </section>
        <section id="environment">
          <EnvironmentalPanel />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
