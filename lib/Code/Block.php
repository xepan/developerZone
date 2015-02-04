<?php

namespace developerZone;

class Code_Block extends Model_CodeFlow {

	function generateCode(){

		$code_block =$this->add('developerZone/Code');
		$code_block->hasBlock('//'. $this['name'],true);

		// $my_child_code_flow = $this->add('developerZone/Model_CodeFlow');
		// $my_child_code_flow->addCondition('parent_block_id',$this->id);
		
		// $code_block->addCode($my_child_code_flow->geterateCode($this['id']));

		return $code_block->generateCode();
		$destination_ports = $this->getConnectedDestinationPorts();
		// create a unique variable for next port here
		return "// from Block " . $this['name'];
	}

}