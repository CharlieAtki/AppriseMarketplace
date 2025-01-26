import HomePageNavigationBar from "../../components/homePage/homePageNavigationBar";
import HomePageFeaturedSection from "../../components/homePage/homePageFeaturedSection";

const HomePage = () => {
    return (
        <div>
            <HomePageNavigationBar title="Apprise Marketplace" subtitle="Holidays Made Simple" />
            <HomePageFeaturedSection />
        </div>
  )
}

export default HomePage;