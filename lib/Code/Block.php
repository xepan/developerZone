<?php

namespace developerZone;

class Code_Block extends Model_CodeFlow {

	function generateCode(){

		$code_block =$this->add('developerZone/Code');
		$code_block->hasBlock('//'. $this['name'],true);

		$my_child_code_flow = $this->add('developerZone/Model_CodeFlow');
		$my_child_code_flow->addCondition('parent_block_id',$this->id);
		$my_child_code_flow->addCondition('connections_in',0);
		
		foreach($my_child_code_flow as $mcf){
			// echo "---block child ". $mcf['id']. '<br/>';
			$my_child_code_flow->set('is_proccessed',true)->save();
			$code_block->addCode($mcf->geterateCode());
		}

		return $code_block->generateCode();
		$destination_ports = $this->getConnectedDestinationPorts();
		// create a unique variable for next port here
		return "// from Block " . $this['name'];
	}

}