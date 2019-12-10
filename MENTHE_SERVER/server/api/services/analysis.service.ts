import { dbWorkFlow } from './workflows.service';
import { IWorkflow } from '../models/workflows.model';
import * as he from 'he';
import * as parser from 'fast-xml-parser';
import l from '../../common/logger';

class Analysis {

    async getWorkFlowData(id: string) {
        const options = {
            attributeNamePrefix: '',
            attrNodeName: 'attr',
            textNodeName: '#text',
            ignoreAttributes: false,
            ignoreNameSpace: true,
            allowBooleanAttributes: true,
            parseNodeValue: true,
            parseAttributeValue: true,
            trimValues: true,
            attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
            tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
            stopNodes: ['BPMNDiagram'],
          };
        let bpmnData = '';
        l.debug('Search for workflow id : ', id);
        const workflow = await dbWorkFlow.findWorkflowById(id);
        if (typeof(workflow) !== 'undefined') {
            const xml = workflow.xmlcontent;
            if (parser.validate(xml) === true) {
                bpmnData = parser.parse(xml, options);
              } else {
                console.log('XML parsing failure...');
              }
            return bpmnData;
        } else {
            return JSON.stringify('');
        }


        // dbWorkFlow.findWorkflowById(id).then(
        //     workflow => {
        //         l.debug(workflow);
        //         if (parser.validate(workflow.xmlcontent) === true) {
        //             return parser.parse(workflow.xmlcontent, options);
        //         } else {
        //             return null;
        //         }
        //     }
        // )
    }

}

export const analysis = new Analysis();