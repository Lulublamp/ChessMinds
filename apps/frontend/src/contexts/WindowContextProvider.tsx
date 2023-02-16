import { useContext } from "react";
import { WindowContext } from "./WindowContext";

const useWindowContext = () => useContext(WindowContext)

export default useWindowContext