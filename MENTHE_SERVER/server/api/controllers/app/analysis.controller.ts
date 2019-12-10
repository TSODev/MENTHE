import { Request, Response } from 'express';
import { analysis } from "../../services/analysis.service";

export class AnalysisController {

    async getWorkflowData(req: Request, res: Response) {
        const data = await analysis.getWorkFlowData(req.params.id);
        res.status(200).json({data: data});

    }
}

export default new AnalysisController();