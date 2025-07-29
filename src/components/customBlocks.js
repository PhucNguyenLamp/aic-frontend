import * as Blockly from 'blockly';

export function registerCustomBlocks() {
    Blockly.Blocks['query_block'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("")
                .appendField(new Blockly.FieldTextInput("text"), "TEXT")
                .appendField(new Blockly.FieldDropdown([
                    ["📝", "TEXT"],
                    ["📷", "OBJECT"],
                    ["🎤", "AUDIO"]
                ]), "TYPE");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
        },
    };

    Blockly.Blocks['parallel_block'] = {
        init: function () {
            this.appendStatementInput("STACK")
                .setCheck(null)
                .appendField("🔀");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(200);
        },
    };

    Blockly.Blocks['sequential_block'] = {
        init: function () {
            this.appendStatementInput("STACK")
                .setCheck(null)
                .appendField("➡️");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(240);
        },
    };
}

registerCustomBlocks();