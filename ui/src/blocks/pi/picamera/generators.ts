export default function define(Python: Blockly.BlockGenerators) {
  Python['import_picamera'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'from picamera import *\n';
    return code;
  };

  
}

