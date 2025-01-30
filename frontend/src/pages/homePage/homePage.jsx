import HomePageNavigationBar from "../../components/homePage/homePageNavigationBar";
import HomePageFeaturedSection from "../../components/homePage/homePageFeaturedSection";
import HomePageBusinessSection from "../../components/homePage/homePageBusinessSection";

const HomePage = () => {
    return (
        <div>
            <HomePageNavigationBar title="Apprise Marketplace" subtitle="Holidays Made Simple" />
            <HomePageFeaturedSection />
            <HomePageBusinessSection />
        </div>
  )
}

export default HomePage;