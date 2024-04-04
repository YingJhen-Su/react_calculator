import CalculatorResult from "./feature/calculator/CalculatorResult";
import CalculatorButtons from "./feature/calculator/CalculatorButtons";

const App = () => {
    return (
        <div className="calculator bg-black p-3 sm:rounded flex flex-col">
            <CalculatorResult />
            <CalculatorButtons />
        </div>
    );
};

export default App;
