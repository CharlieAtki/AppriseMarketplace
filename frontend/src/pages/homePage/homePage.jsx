import HomePageNavigationBar from "../../components/homePage/homePageNavigationBar";
import HomePageFeaturedSection from "../../components/homePage/homePageFeaturedSection";
import HomePageBusinessSection from "../../components/homePage/homePageBusinessSection";
import HomePageCommentSection from "../../components/homePage/homePageCommentSection";
import HomePageBentoGrid from "../../components/homePage/homePageBentoGrid";
import HomePageHeroSection from "../../components/homePage/homePageHeroSection";

const HomePage = () => {
    return (
        <div>
            <HomePageHeroSection />
            <HomePageBentoGrid />
            <HomePageCommentSection />
        </div>
  )
}

export default HomePage;