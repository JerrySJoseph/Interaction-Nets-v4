import { uniqueId } from "lodash"

const NodeType = {
    ADD: 0,
    SUB: 1,
    MUL: 2,
    DIV: 3,
    MOD: 4,
    NUM: 5
}

interface INode {
    id: string,
    label: string
    type: number,
    aux: string[],
    principal?: string
    value?: number
}

interface ILink {
    id: string,
    label: string,
    source: string,
    target: string
}


export class InetDB {


    private nodeMap: Record<string, INode> = {}
    private linkMap: Record<string, ILink> = {}

    constructor() {

    }

    public getNodesCount(): number {
        return Object.keys(this.nodeMap).length;
    }

    public getLinksCount(): number {
        return Object.keys(this.linkMap).length;
    }

    public addNode(newNode: INode) {
        this.nodeMap[newNode.id] = newNode;
    }

    public connectNodes(source:string,target:string){
        
        const linkId=uniqueId();
        const link:ILink={
            id:linkId,
            source,
            target,
            label:`Link(${linkId})`
        }
        this.linkMap[linkId]=link
    }

    public showDB() {
        console.warn(this.nodeMap);
        console.warn(this.linkMap)
    }

    private checkNodeExists(nodeId: string) {
        if (nodeId in this.nodeMap)
            return;
        throw new Error(`Node with key: ${nodeId} not found in DB.`)
    }

    isOperator(nodeId: string) {
        this.checkNodeExists(nodeId);
        return this.nodeMap[nodeId].type !== NodeType.NUM;

    }

    getAllAuxNodesFor(nodeId: string):INode[] {

        this.checkNodeExists(nodeId);

        const auxNodes: INode[] = [];

        //run through the aux list of given node
        for(let linkId of this.nodeMap[nodeId].aux){

            //get the link from link map
            const link=this.linkMap[linkId];

            //get the (i)th node id 
            const auxNodeId=link.target;

            //push a copy of the node from database to array
            auxNodes.push({...this.nodeMap[auxNodeId]});
        }
        return auxNodes;
    }

}


function reduce()

const x = new InetDB()
