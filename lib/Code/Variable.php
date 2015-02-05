<?php

namespace developerZone;

class Code_Variable extends Model_CodeFlow {

	function generateCode(){

		$code_block =$this->add('developerZone/Code');
		$code_block->hasBlock('// adding '. $this['name'],true);

		$new_variable_name = $this->generateVariableName("var_");

		$inputs = json_decode($this['inputs'],true);

		$value = is_numeric($inputs['value'])?$inputs['value']: "'".$inputs['value']."'";

		$code = "\n";
		$code.= '$'.$new_variable_name .' = ' . $value .";";
		
		$code_block->addCode($code);
		// create a unique variable for next port here
		$final_code = $code_block->generateCode();
		return $final_code;
	}

	function setDestinationPortVariables(){
		$connections = $this->getConnectedDestinationPorts();
	}

}