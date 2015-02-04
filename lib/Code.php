<?php

namespace developerZone;

class Code extends \AbstractController{
	
	public $has_block=false;
	public $just_container=false;

	public $sub_code=array();
	public $block_starter="";
	public $indent=0;

	function init(){
		parent::init();

	}

	function addCode($code){
		$this->sub_code[] = $code;
	}

	function addBlockStarter($code){
		$this->block_starter = $code;
	}

	function hasBlock($starter_code=null, $just_container=false){
		$this->indent = isset($this->owner->indent)? $this->owner->indent+1 :0;
		$this->has_block = true;
		$this->just_container = $just_container;
		if($starter_code) $this->addBlockStarter($starter_code);
	}

	function generateCode(){
		$indent_pad = str_pad("\t", $this->indent);

		$code_str = $indent_pad;
		if($this->has_block){
			$code_str .= "\n".$this->block_starter;
			if(!$this->just_container) $code_str.= "{\n";
		}
		foreach ($this->sub_code as $sc) {
			if($sc instanceof developerZone\Code){
				$code_str.= $indent_pad.$sc->generateCode();
			}else{
				$code_str .= $indent_pad.$sc ."\n";
			}
		}
		if($this->has_block){
			if(!$this->just_container) $code_str .= "}\n";
		}

		return $code_str;

	}


}