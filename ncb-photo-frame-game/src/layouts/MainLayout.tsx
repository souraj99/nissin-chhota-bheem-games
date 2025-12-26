import { PropsWithChildren } from "react";
import "./MainLayout.scss";

interface MainLayoutProps extends PropsWithChildren {
  className: string;
  contentClass?: string;
  idName?: string;
}

const MainLayout = ({
  children,
  className,
  idName,
  contentClass,
}: MainLayoutProps) => {
  return (
    <div className={`main-layout ${className}`} id={idName}>
      {/* {<SideMenu open={showSideMenu} onClose={() => setShowSideMenu(false)} />} */}
      {/* <header className="">
        <img
          src={IMAGES.Menu}
          alt="menu"
          className="jw-icon"
          onClick={() => setShowSideMenu(true)}
        />
      </header> */}
      <div className={`content ${contentClass}`}>{children}</div>
    </div>
  );
};

export default MainLayout;
