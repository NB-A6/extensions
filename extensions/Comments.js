// Name: Comments
// ID: comments
// Description: Organize and label your code.
// License: MPL-2.0

// Version V.1.0.0

(function (Scratch) {
  "use strict";

  class NBComments {
    getInfo() {
      return {
        id: "comments",
        name: Scratch.translate("Comments"),
        color1: "#E4DB8C",
        color2: "#C6BE79",
        color3: "#A8A167",
        blocks: [
          {
            opcode: "hat",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            text: "// [COMMENT]",
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: "command",
            blockType: Scratch.BlockType.COMMAND,
            text: "// [COMMENT]",
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: "loop",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: "// [COMMENT]",
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: "reporter",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VALUE] // [COMMENT]",
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: "boolean",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[VALUE] // [COMMENT]",
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.BOOLEAN
              },
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: "object",
            blockType: Scratch.BlockType.OBJECT,
            text: "[VALUE] // [COMMENT]",
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.OBJECT
              },
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: "array",
            blockType: Scratch.BlockType.ARRAY,
            text: "[VALUE] // [COMMENT]",
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.ARRAY
              },
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          }
        ]
      };
    }

    hat() {
      // no-op
    }

    command() {
      // no-op
    }

    loop() {
      return true;
    }

    reporter({ VALUE }) {
      return VALUE;
    }

    boolean({ VALUE }) {
      return VALUE || false;
    }

    object({ VALUE }) {
      return VALUE || {};
    }

    array({ VALUE }) {
      return VALUE || [];
    }
  }

  Scratch.extensions.register(new NBComments());
})(Scratch);