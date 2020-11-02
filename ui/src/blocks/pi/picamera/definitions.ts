export default function define(Blocks: Blockly.BlockDefinitions) {
  Blocks['import_picamera'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("from picamera import *");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#1B173C");
      this.setTooltip("Import PiCamera and Color library");
      this.setHelpUrl("");
    }
  };

 
}
