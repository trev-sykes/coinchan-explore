import { useState } from "react";
import Logo from "../../../components/common/logo/Logo";
import styles from "./SwapScreen.module.css";
import { ArrowUpDown, Plus } from "lucide-react";

// Define options with value, label, and image
const exampleOptions = [
    { value: "option0", label: "0", },
    { value: "option1", label: "1", },
    { value: "option2", label: "2", },
];

interface DropdownProps {
    selectedOption: typeof exampleOptions[0];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (option: typeof exampleOptions[0]) => void;
    className: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    selectedOption,
    isOpen,
    onToggle,
    onSelect,
    className,
}) => {
    const handleSelect = (option: typeof exampleOptions[0], e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(option);
    };

    return (
        <div className={`${styles.dropDown} ${className}`} role="combobox" aria-expanded={isOpen}>
            <div className={styles.selected} onClick={onToggle} aria-label="Select option">
                <Logo isDark={true} width={15} height={15} />
                <span>{selectedOption.label}</span>
            </div>
            {isOpen && (
                <ul className={styles.options} role="listbox">
                    {exampleOptions.map((option) => (
                        <li
                            key={option.value}
                            className={styles.option}
                            onClick={(e) => handleSelect(option, e)}
                            role="option"
                            aria-selected={selectedOption.value === option.value}
                        >
                            <Logo isDark={true} width={15} height={15} />
                            <span>{option.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface InputProps {
    input: string;
    onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ input, onChange }) => (
    <input
        className={styles.input}
        type="number"
        value={input}
        onChange={(e) => onChange(e.target.value)}
    />
);

export const SwapScreen: React.FC = () => {
    const [activeSection, setActiveSection] = useState<"swap" | "liquidity">("swap");
    const [swappedDestination, setSwappedDestination] = useState(false);
    const [toInput, setToInput] = useState("");
    const [fromInput, setFromInput] = useState("");
    const [toOption, setToOption] = useState(exampleOptions[0]);
    const [fromOption, setFromOption] = useState(exampleOptions[1]);
    const [toOpen, setToOpen] = useState(false);
    const [fromOpen, setFromOpen] = useState(false);

    const handleSwapButtonClick = () => {
        setSwappedDestination((prev) => !prev);
        setToOption(fromOption);
        setFromOption(toOption);
        setToInput(fromInput);
        setFromInput(toInput);
        setToOpen(false);
        setFromOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.swapTile}>
                <div className={styles.swapHeader}>
                    <p className={styles.swapDescription}>
                        total tokens <span className={styles.number}>{123}</span>
                    </p>
                </div>
                <div className={styles.swapActions}>
                    <div
                        className={`${styles.actionButton} ${activeSection === "swap" ? styles.active : ""}`}
                        onClick={() => setActiveSection("swap")}
                    >
                        <span>
                            <ArrowUpDown size={15} />
                        </span>
                        Swap
                    </div>
                    <div
                        className={`${styles.actionButton} ${activeSection === "liquidity" ? styles.active : ""
                            }`}
                        onClick={() => setActiveSection("liquidity")}
                    >
                        <span>
                            <Plus size={15} />
                        </span>
                        Liquidity
                    </div>
                </div>
                <div className={styles.swapContent}>
                    <div className={`${styles.swapItem} ${styles.sell}`}>
                        <div className={styles.topSwapContent}>
                            <p>From</p>
                            <span>
                                <Dropdown
                                    selectedOption={fromOption}
                                    isOpen={fromOpen}
                                    onToggle={() => setFromOpen((prev) => !prev)}
                                    onSelect={(option) => {
                                        setFromOption(option);
                                        setFromOpen(false);
                                    }}
                                    className={styles.from}
                                />
                            </span>
                        </div>
                        <div className={styles.middleSwapContent}>
                            <Input input={fromInput} onChange={setFromInput} />
                        </div>
                    </div>
                    <div className={styles.swapButton}>
                        <ArrowUpDown
                            onClick={handleSwapButtonClick}
                            size={40}
                            color="white"
                        />
                    </div>
                    <div className={`${styles.swapItem} ${styles.buy}`}>
                        <div className={styles.topSwapContent}>
                            <p>To</p>
                            <span>
                                <Dropdown
                                    selectedOption={toOption}
                                    isOpen={toOpen}
                                    onToggle={() => setToOpen((prev) => !prev)}
                                    onSelect={(option) => {
                                        setToOption(option);
                                        setToOpen(false);
                                    }}
                                    className={styles.to}
                                />
                            </span>
                        </div>
                        <div className={styles.middleSwapContent}>
                            <Input input={toInput} onChange={setToInput} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};