import styles from "./Logo.module.css";
import imgLight from "../../../assets/logo-light.png";
import imgDark from "../../../assets/logo-dark.png";

interface LogoProps {
    isDark: boolean;
    width?: number | string;
    height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ isDark, width = '10rem', height = '10rem' }) => {
    const src = isDark ? imgDark : imgLight;

    const computedWidth = typeof width === 'number' ? `${width}px` : width;
    const computedHeight = typeof height === 'number' ? `${height}px` : height;

    return (
        <img
            className={styles.logo}
            style={{ width: computedWidth, height: computedHeight }}
            src={src}
            alt="logo"
        />
    );
};

export default Logo;
