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
      attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
      tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
      stopNodes: ['BPMNDiagram'],
    };
    let bpmnData = '';
    let data = '';
    const workflow = await dbWorkFlow.findWorkflowById(id);
    if (typeof (workflow) !== 'undefined') {
      const xml = workflow.xmlcontent;
      if (parser.validate(xml) === true) {
        bpmnData = parser.parse(xml, options);
        data = bpmnData;
      } else {
        console.log('XML parsing failure...');
        data = '{error: "XML parsing failure"}'
      }
      return data;
    } else {
      return JSON.stringify('');
    }

  }

  async getParticipant(id: string) {
    const data = await this.getWorkFlowData(id);
    return data['definitions'].collaboration.participant;
  }

  async getProcesses(workflowid: string) {
    const data = await this.getWorkFlowData(workflowid);
    return data['definitions'].process;
  }


  async getProcess(workflowid: string, processid: string) {
    const processes = await this.getProcesses(workflowid);
    return processes.filter(o => o.attr.id === processid);
  }

  async getStartEvents(workflowid: string) {
    const data = await this.getProcesses(workflowid);
    const startEvents = [];
    data.forEach(element => {
      startEvents.push(element.startEvent);
    });
    return startEvents;
  }

  async getStartEvent(workflowid: string, processid: string) {
    const processes = await this.getProcesses(workflowid);
    return processes.filter(o => o.attr.id === processid)[0].startEvent;
  }

  async getEndEvents(workflowid: string) {
    const data = await this.getProcesses(workflowid);
    const endEvents = [];
    data.forEach(element => {
      endEvents.push(element.startEvent);
    });
    return endEvents;
  }

  async getEndEvent(workflowid: string, processid: string) {
    const processes = await this.getProcesses(workflowid);
    return processes.filter(o => o.attr.id === processid)[0].endEvent;
  }


}

export const analysis = new Analysis();