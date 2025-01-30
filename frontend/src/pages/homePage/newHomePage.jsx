import HomePageNavigationBar from "../../components/homePage/homePageNavigationBar";
import HomePageFeaturedSection from "../../components/homePage/homePageFeaturedSection";
import { motion } from "framer-motion";
import singaporeImg from '../../assets/Singapore.jpg';

const NewHomePage = () => {
    return (
        <div>
            <div
                className=" bg-cover bg-center min-h-screen"
                style={{backgroundImage: `url(${singaporeImg})`}} // ✅ Correct way
            >
                <HomePageNavigationBar title={"Apprise Marketplace"}/>
            </div>
            <div>
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 50}}
                    viewport={{once: false, amount: 0.2}}
                    transition={{duration: 0.5}}
                >
                    <HomePageFeaturedSection/>
                </motion.div>
            </div>
        </div>


    )
}

export default NewHomePage
