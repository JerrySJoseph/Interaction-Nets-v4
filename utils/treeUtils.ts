import { TreeNode,Tree } from "../data/models/tree";
import {cloneDeep,uniqueId} from 'lodash';

export const addNode=(value:number,root:TreeNode):TreeNode|undefined=>{
   const rootCopy=cloneDeep(root);
   return _addNodeImp(value,rootCopy);
}

function _addNodeImp(value:number,currentNode?:TreeNode):TreeNode{
    if(!currentNode)return {
        value
    };
    if(value>currentNode.value){
        if(!currentNode.rightNode)
            currentNode.rightNode={value}
        else _addNodeImp(value,currentNode.rightNode)    
    }
    else if(value<currentNode.value){
        if(!currentNode.leftNode)
            currentNode.leftNode={value}
        else _addNodeImp(value,currentNode.leftNode)
    }
    return {...currentNode};
}
