const input = "($b + SQRT(SQR($b) - 4 * $a)) / (2 * $a)";

// POSIBILIDADES:
// ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, NUMBER, VARIABLE, PAREN, FUNCTION, POWER, E, PI

export enum OperationTypes {
  "ADDITION" = "ADDITION",
  "SUBTRACTION" = "SUBTRACTION",
  "MULTIPLICATION" = "MULTIPLICATION",
  "DIVISION" = "DIVISION",
}

export enum ValueTypes {
  "NUMBER" = "NUMBER",
  "E" = "E",
  "PI" = "PI",
}

export enum FuncTypes {
  "SQRT" = "SQRT",
  "SQR" = "SQR",
}

export enum SignTypes {
  "PAREN" = "PAREN",
  "POWER" = "POWER",
}

export type VariableType = "VARIABLE";
export type FuncType = "FUNCTION";
export const VariableTypeName = "VARIABLE";
export const FuncTypeName = "FUNCTION";

export interface IBaseNode {
  type: string;
}

export type SignType = IBaseNode & {
  expression: ASTNode;
};

export type Paren = SignType & {
  type: SignTypes.PAREN;
};

export type Power = SignType & {
  type: SignTypes.POWER;
  power: ASTNode;
};

export type Oper = IBaseNode & {
  type: OperationTypes;
  left: ASTNode;
  right: ASTNode;
};

export type Value = IBaseNode & {
  type: ValueTypes;
  value: number;
};

export type Var = IBaseNode & {
  type: VariableType;
  name: string;
};

export type Func = IBaseNode & {
  type: FuncType;
  name: FuncTypes;
  arguments: ASTNode[];
};

export type ASTNode = Paren | Power | Value | Var | Func | Oper;

const ASTExample: ASTNode = {
  type: SignTypes.PAREN,
  expression: {
    type: OperationTypes.ADDITION,
    left: {
      type: SignTypes.PAREN,
      expression: {
        type: OperationTypes.MULTIPLICATION,
        left: {
          type: ValueTypes.NUMBER,
          value: 2,
        },
        right: {
          type: ValueTypes.NUMBER,
          value: 4,
        },
      },
    },
    right: {
      type: ValueTypes.NUMBER,
      value: 5,
    },
  },
};

export const iterateAST = (node: ASTNode): string => {
  const currentNode = node;

  // check if Paren type
  if ("expression" in currentNode && currentNode.type === SignTypes.PAREN) {
    return `(${iterateAST((node as Paren).expression)})`;
  }

  // check if Number type
  if ("value" in currentNode && currentNode.type === ValueTypes.NUMBER) {
    return `${currentNode.value}`;
  }

  // check if E or Pi type
  if (
    "value" in currentNode &&
    Object.values(ValueTypes)
      .filter((type) => type !== ValueTypes.NUMBER)
      .includes(currentNode.type as ValueTypes)
  ) {
    return `${currentNode.type}`;
  }

  // check if Variable type
  if ("name" in currentNode && currentNode.type === VariableTypeName) {
    return `${currentNode.name}`;
  }

  // check if Operation type
  if ("left" in currentNode && "right" in currentNode) {
    let sign = "";

    switch (currentNode.type) {
      case OperationTypes.ADDITION:
        sign = "+";
        break;
      case OperationTypes.SUBTRACTION:
        sign = "-";
        break;
      case OperationTypes.MULTIPLICATION:
        sign = "*";
        break;
      case OperationTypes.DIVISION:
        sign = "/";
        break;
    }

    return `${iterateAST(currentNode.left)} ${sign} ${iterateAST(
      currentNode.right
    )}`;
  }

  // check if Power type
  if ("power" in currentNode && currentNode.type === SignTypes.POWER) {
    return `${iterateAST(currentNode.expression)}^${iterateAST(
      currentNode.power
    )}`;
  }

  // check if Func type
  if ("arguments" in currentNode && currentNode.type === FuncTypeName) {
    const args = currentNode.arguments.map((arg) => iterateAST(arg));

    return `${currentNode.name.toUpperCase()}(${args.join(", ")})`;
  }

  return "";
};

console.log(iterateAST(ASTExample));
