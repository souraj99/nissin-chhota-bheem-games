// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGlobalLoaderContext } from "./helpers/GlobalLoader";
import { useGlobalModalContext } from "./helpers/GlobalModal";
import API from "./api";
// import { ROUTES } from "./lib/consts";
import AllRoutes from "./router";
import { cacheTrackingIds } from "./lib/utils";
import { setGlobalShowModal } from "./api/utils";
import { IMAGES } from "./lib/images";
// import { store } from "./store/store";
// import { setUserKey } from "./store/slices/authSlice";
// import Skelton from "./components/skeliton/Skeliton";

function App() {
  const { showLoader, hideLoader } = useGlobalLoaderContext();
  const { showModal } = useGlobalModalContext();
  // const [isUserLoading, setIsUserLoading] = useState(false);

  // const navigate = useNavigate();
  useEffect(() => {
    API.initialize(showLoader, hideLoader);
    setGlobalShowModal(showModal);
    // setIsUserLoading(true);

    // API.createUser()
    //   .then((response) => {
    //     store.dispatch(setUserKey(response));
    //     logoutUser();
    //     navigate(ROUTES.HOME, { replace: true });
    //     setIsUserLoading(false);
    //   })
    //   .catch(() => {
    //     setIsUserLoading(false);
    //   });

    window.addEventListener("online", () => {
      API.setIsOnline(true);
    });
    window.addEventListener("offline", () => {
      API.setIsOnline(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cacheTrackingIds();
  }, []);

  useEffect(() => {
    // Preload critical images
    const imagesToPreload = [
      IMAGES.GsGroupImg,
      IMAGES.PhotoFrame1,
      IMAGES.PhotoFrame2,
      IMAGES.PhotoFrame3,
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return <div className="App">{<AllRoutes />}</div>;
}

export default App;
