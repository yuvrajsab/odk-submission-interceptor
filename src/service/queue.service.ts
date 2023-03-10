import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { RequestQueue } from '@prisma/client';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('dietWeekly') private readonly dietWeeklyQueue: Queue,
    @InjectQueue('dietMonthly') private readonly dietMonthlyQueue: Queue,
  ) {}

  async pushRequestToQueue(request: RequestQueue) {
    if (request.form_id === 'dietsweeky_v2') {
      try {
        await this.dietWeeklyQueue.add('dietWeeklySubmission', request);
        return 'Successfully Submitted dietWeekly Form!!';
      } catch (e: unknown) {
        return `Request failed for dietWeekly Form: ${(<Error>e).message}`;
      }
    } else if (['monthlyform_v1', 'monthlyform_v2'].includes(request.form_id)) {
      try {
        await this.dietMonthlyQueue.add('dietMonthlySubmission', request);
        return 'Successfully Submitted dietMonthly Form!!';
      } catch (e: unknown) {
        return `Request failed for dietMonthly Form: ${(<Error>e).message}`;
      }
    }
  }
}
