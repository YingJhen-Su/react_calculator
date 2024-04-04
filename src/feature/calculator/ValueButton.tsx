import { useAppDispatch } from "../../app/hooks";
import { handleValue } from "./calculatorSlice";

type ValueProps = {
    id: string;
    value: string;
};

const ValueButton = ({ id, value }: ValueProps) => {
    const dispatch = useAppDispatch();

    return (
        <button
            id={id}
            className="bg-gray-600 hover:bg-gray-500 text-white rounded"
            onClick={() => dispatch(handleValue(value))}
        >
            {value}
        </button>
    );
};

export default ValueButton;
