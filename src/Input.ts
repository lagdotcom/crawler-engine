export interface AdvanceInput {
  type: "advance";
}

export interface BackInput {
  type: "back";
}

export interface SlideInput {
  type: "slide";
  direction: "l" | "r";
}

export interface TurnInput {
  type: "turn";
  direction: "l" | "r";
}

type Input = AdvanceInput | BackInput | SlideInput | TurnInput;
export default Input;
