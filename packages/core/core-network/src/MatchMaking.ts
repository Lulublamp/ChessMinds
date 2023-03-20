import { MATCHMAKING_MODE, MATCHMAKING_MODES_OPTIONS } from "./Namespace";

export interface JoinQueuOption {
  mode: MATCHMAKING_MODE,
  modeOption: {
    style: MATCHMAKING_MODES_OPTIONS,
  }
}