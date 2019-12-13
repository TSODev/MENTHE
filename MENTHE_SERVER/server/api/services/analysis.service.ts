import { dbWorkFlow } from './workflows.service';
import * as he from 'he';
import * as parser from 'fast-xml-parser';
import * as R from 'ramda';
import l from '../../common/logger';
import { IUser } from '../models/users.model';
import { Publication } from '../models/publish.model';


class Analysis {

private switchOnInsertPublicationElement = R.cond([
  [R.pipe(R.prop('role'), R.equals('Workflow')),      element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Participant')),  element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Process')),      element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('StartEvent')),   element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('EndEvent')),     element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Task')),         element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Gateway')),      element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Flow')),         element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Owner')),        element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Mapping')),      element => console.log(element.object)],
  [R.T,  element => console.log('This ' + element.role + ' is not supported' )]
]);

private switchOnRemovePublicationElement = R.cond([
  [R.pipe(R.prop('role'), R.equals('Workflow')),      element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Participant')),  element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Process')),      element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('StartEvent')),   element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('EndEvent')),     element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Task')),         element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Gateway')),      element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Flow')),         element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Owner')),        element => console.log(element.object)],
  [R.pipe(R.prop('role'), R.equals('Mapping')),      element => console.log(element.object)],
  [R.T,  element => console.log('This ' + element.role + ' is not supported' )]
]);


  private switchOnPublicationAction = R.cond([
    [R.pipe(R.prop('action'), R.equals('INSERT')),  data => this.switchOnInsertPublicationElement(data.post)],
    [R.pipe(R.prop('action'), R.equals('REMOVE')),  data => this.switchOnRemovePublicationElement(data.post)],
    [R.T,  action => console.log('Don t know what to do with this action : ' + action)]
  ]);
  

  private actionOnEachPublication = (pub: Publication) => {
    this.switchOnPublicationAction(pub);
  }
  
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

  async getWorkFlowXML(worlkflowId: string){
    return new Promise (resolve => 
        { dbWorkFlow.findWorkflowById(worlkflowId)
          .then(data => resolve(data.xmlcontent))
          .catch(err => l.error(err))
        })
  }

  async analyseData(worlkflowId: string) {
    const elementList = new Array;
    const workKeyList = new Array;
    const elementKeyList = new Array;
    return new Promise (resolve => 
      {
        this.getWorkFlowData(worlkflowId)
          .then (data => {
            const definitionKeys = Object.keys(data['definitions']);
            definitionKeys.forEach(key => {
              workKeyList.push({key: key});
            });
            workKeyList.forEach(
              element => {
                elementList.push(
                  {
                    key: element.key,
                    elementdata: data['definitions'][element.key],
                  }
                )
              }
            )

            const result = new Array();
            result.push({workflow: {id: worlkflowId}});
            elementList.forEach(
              element => {

                    if (!Array.isArray(element.elementdata)) {
                      const array = [];
                      array.push(element.elementdata);
                      element.elementdata = array;
                    }

                    const o: Object = new Object();
                    o[element.key] = element.elementdata;
                    result.push(o)

              }
            )
            resolve(result);
          })
          .catch(err => l.error(err))
      })
  }



  createPublication(publication: Publication[], user: IUser) {
    R.forEach(this.actionOnEachPublication, publication);
  }

}

export const analysis = new Analysis();