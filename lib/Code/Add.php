<?php

namespace developerZone;

class Code_Add extends Model_CodeFlow {

	function generateCode(){

		$code_block =$this->add('developerZone/Code');
		$code_block->hasBlock('// adding '. $this['name'],true);

		$new_variable_name = $this->generateVariableName();

		$code = "\n";
		$code.= '$'.$new_variable_name .' = $this->add("'.$this->ref('developerZone_entities_id')->get('name').'");';
		
		$code_block->addCode($code);
		// create a unique variable for next port here
		return "\n// Add  " . $this['name'] . "\n" . $code_block->generateCode();
	}

}