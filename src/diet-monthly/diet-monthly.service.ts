import { Injectable, Logger } from '@nestjs/common';
import { DietWeeklyService } from 'src/diet-weekly/diet-weekly.service';
import { AppService } from '../app.service';
import { ODKSubmissionHelper } from '../helper/odk-submission.helper';
import { DietMonthlySubmissionData } from './diet-monthly.interface';

@Injectable()
export class DietMonthlyService {
  private readonly logger = new Logger(DietMonthlyService.name);

  constructor(
    private readonly appService: AppService,
    private readonly dietWeeklyService: DietWeeklyService,
    private readonly odkSubmissionHelper: ODKSubmissionHelper,
  ) {}

  getFromDesignationMap(designation: string): string {
    if (designation === 'lecturer') {
      return 'Lecturer';
    } else if (designation === 'wing_head') {
      return 'Wing-head';
    } else if (designation === 'principal') {
      return 'Principal';
    }
    return designation;
  }

  createMappingForPdf(data: DietMonthlySubmissionData) {
    return {
      username: this.odkSubmissionHelper.validateData(data.user_name),
      month: this.odkSubmissionHelper.extractMonthNameFromDate(data.month),
      year: '2023',
      name: this.odkSubmissionHelper.validateData(data.name),
      designation: this.getFromDesignationMap(data.designation),
      wingname: this.dietWeeklyService.getFromWingNameMap(data.wingname),

      ifsc_unique_school_visits: this.odkSubmissionHelper.validateData(
        data.ifsc_unique_school_visits,
      ),
      ifsc_mentor_meetings: this.odkSubmissionHelper.validateData(
        data.ifsc_mentor_meetings,
      ),
      ifsc_astermentor_meetings: this.odkSubmissionHelper.validateData(
        data.ifsc_astermentor_meetings,
      ),
      ifsc_grievances_recorded: this.odkSubmissionHelper.validateData(
        data.ifsc_grievances_recorded,
      ),
      ifsc_grievances_resolved: this.odkSubmissionHelper.validateData(
        data.ifsc_grievances_resolved,
      ),
      ifsc_tna: this.odkSubmissionHelper.validateData(data.ifsc_tna),
      ifsc_trainings_planned: this.odkSubmissionHelper.validateData(
        data.ifsc_trainings_planned,
      ),
      ifsc_trainings_actual: this.odkSubmissionHelper.validateData(
        data.ifsc_trainings_actual,
      ),
      ifsc_research_trainings: this.odkSubmissionHelper.validateData(
        data.ifsc_research_trainings,
      ),
      ifsc_scertmandated_trainings: this.odkSubmissionHelper.validateData(
        data.ifsc_scertmandated_trainings,
      ),
      ifsc_tnabased_trainings: this.odkSubmissionHelper.validateData(
        data.ifsc_tnabased_trainings,
      ),
      ifsc_leadership_trainings: this.odkSubmissionHelper.validateData(
        data.ifsc_leadership_trainings,
      ),
      ifsc_induction_trainings: this.odkSubmissionHelper.validateData(
        data.ifsc_induction_trainings,
      ),
      ifsc_refresher_trainings: this.odkSubmissionHelper.validateData(
        data.ifsc_refresher_trainings,
      ),
      ifsc_direct_interventions: this.odkSubmissionHelper.validateData(
        data.ifsc_direct_interventions,
      ),
      ifsc_teacher_attendance50: this.odkSubmissionHelper.validateData(
        data.ifsc_teacher_attendance50,
      ),
      ifsc_teacher_attendance100: this.odkSubmissionHelper.validateData(
        data.ifsc_teacher_attendance100,
      ),

      pm_trainings_planned: this.odkSubmissionHelper.validateData(
        data.pm_trainings_planned,
      ),
      pm_trainings_actual: this.odkSubmissionHelper.validateData(
        data.pm_trainings_actual,
      ),
      pm_leadershiptrainings_planned: this.odkSubmissionHelper.validateData(
        data.pm_leadershiptrainings_planned,
      ),
      pm_leadershiptrainings_actual: this.odkSubmissionHelper.validateData(
        data.pm_leadershiptrainings_actual,
      ),

      et_tlm: this.odkSubmissionHelper.validateData(data.et_tlm),
      et_trainings_planned: this.odkSubmissionHelper.validateData(
        data.et_trainings_planned,
      ),
      et_trainings_actual: this.odkSubmissionHelper.validateData(
        data.et_trainings_actual,
      ),
      et_trainings_digcontent: this.odkSubmissionHelper.validateData(
        data.et_trainings_digcontent,
      ),
      et_trainings_samiksha: this.odkSubmissionHelper.validateData(
        data.et_trainings_samiksha,
      ),
      et_trainings_tablets: this.odkSubmissionHelper.validateData(
        data.et_trainings_tablets,
      ),
      et_trainings_prashnavali: this.odkSubmissionHelper.validateData(
        data.et_trainings_prashnavali,
      ),
      et_trainings_cybersafety: this.odkSubmissionHelper.validateData(
        data.et_trainings_cybersafety,
      ),
      et_grievancesrecorded: this.odkSubmissionHelper.validateData(
        data.et_grievancesrecorded,
      ),
      et_grievancesresolved: this.odkSubmissionHelper.validateData(
        data.et_grievancesresolved,
      ),
      et_website_updates: this.odkSubmissionHelper.validateData(
        data.et_website_updates,
      ),
      et_socialmedia_updates: this.odkSubmissionHelper.validateData(
        data.et_socialmedia_updates,
      ),

      pste_schools_sip: this.odkSubmissionHelper.validateData(
        data.pste_schools_sip,
      ),
      pste_mentoringsessions: this.odkSubmissionHelper.validateData(
        data.pste_mentoringsessions,
      ),
      pste_monitoringvisits: this.odkSubmissionHelper.validateData(
        data.pste_monitoringvisits,
      ),
      pste_careercounsellingsessions: this.odkSubmissionHelper.validateData(
        data.pste_careercounsellingsessions,
      ),
      pste_careercounsellingsessions_students:
        this.odkSubmissionHelper.validateData(
          data.pste_careercounsellingsessions_students,
        ),
      pste_trainings_mentalhealth: this.odkSubmissionHelper.validateData(
        data.pste_trainings_mentalhealth,
      ),
      pste_schoolscovered_mentalhealth: this.odkSubmissionHelper.validateData(
        data.pste_schoolscovered_mentalhealth,
      ),

      we_trainings_vocational_planned: this.odkSubmissionHelper.validateData(
        data.we_trainings_vocational_planned,
      ),
      we_trainings_vocational_actual: this.odkSubmissionHelper.validateData(
        data.we_trainings_vocational_actual,
      ),

      cmde_pedagogy_trainings: this.odkSubmissionHelper.validateData(
        data.cmde_pedagogy_trainings,
      ),
      cmde_refreshers_contentdev: this.odkSubmissionHelper.validateData(
        data.cmde_refreshers_contentdev,
      ),
      cmde_trainings_tablets: this.odkSubmissionHelper.validateData(
        data.cmde_trainings_tablets,
      ),
      cmde_tlm: this.odkSubmissionHelper.validateData(data.cmde_tlm),
      cmde_studentassessmenttools: this.odkSubmissionHelper.validateData(
        data.cmde_studentassessmenttools,
      ),
      cmde_teacherassessmenttools: this.odkSubmissionHelper.validateData(
        data.cmde_teacherassessmenttools,
      ),

      dru_awarenessprog_planned: this.odkSubmissionHelper.validateData(
        data.dru_awarenessprog_planned,
      ),
      dru_awarenessprog_actual: this.odkSubmissionHelper.validateData(
        data.dru_awarenessprog_actual,
      ),
    };
  }

  async storePdfUrl(
    pdfUrl: string,
    submission: DietMonthlySubmissionData,
    formId: string,
  ) {
    const gqlQuery = `mutation {
        insert_diet_monthly_reports_one(object: {
          creation_date: "${submission.month}", 
          mentor_username: "${submission.user_name}", 
          odk_form_id: "${formId}", 
          pdf_url: "${pdfUrl}", 
          submission_date: "${submission['*meta-submission-date*']}", 
          wing: "${this.dietWeeklyService.getWingNameShortForm(
            submission.wingname,
          )}"
        }) {
          pdf_url
        }
      }`;

    return this.appService.sendGqlRequest(gqlQuery);
  }

  dumpSubmission(submission: DietMonthlySubmissionData) {
    const mapping = this.createMappingForPdf(submission);
    const gqlQuery = `mutation {
      insert_diet_monthly_data_one(object: {
        cmde_pedagogy_trainings: "${mapping.cmde_pedagogy_trainings}", 
        cmde_refreshers_contentdev: "${mapping.cmde_refreshers_contentdev}", 
        cmde_studentassessmenttools: "${mapping.cmde_studentassessmenttools}", 
        cmde_teacherassessmenttools: "${mapping.cmde_teacherassessmenttools}", 
        cmde_tlm: "${mapping.cmde_tlm}", 
        cmde_trainings_tablets: "${mapping.cmde_trainings_tablets}", 
        cmde_upload_report: "${this.odkSubmissionHelper.getAttachmentLink(
          submission.cmde_upload_report,
        )}", 
        designation: "${mapping.designation}", 
        dru_awarenessprog_actual: "${mapping.dru_awarenessprog_actual}", 
        dru_awarenessprog_planned: "${mapping.dru_awarenessprog_planned}", 
        dru_upload_report: "", 
        et_grievancesrecorded: "${mapping.et_grievancesrecorded}", 
        et_grievancesresolved: "${mapping.et_grievancesresolved}", 
        et_socialmedia_updates: "${mapping.et_socialmedia_updates}", 
        et_tlm: "${mapping.et_tlm}", 
        et_trainings_actual: "${mapping.et_trainings_actual}", 
        et_trainings_cybersafety: "${mapping.et_trainings_cybersafety}", 
        et_trainings_digcontent: "${mapping.et_trainings_digcontent}", 
        et_trainings_planned: "${mapping.et_trainings_planned}", 
        et_trainings_prashnavali: "${mapping.et_trainings_prashnavali}", 
        et_trainings_samiksha: "${mapping.et_trainings_samiksha}", 
        et_trainings_tablets: "${mapping.et_trainings_tablets}", 
        et_upload_report: "", 
        et_website_updates: "${mapping.et_website_updates}", 
        ifsc_astermentor_meetings: "${mapping.ifsc_astermentor_meetings}", 
        ifsc_direct_interventions: "${mapping.ifsc_direct_interventions}", 
        ifsc_grievances_recorded: "${mapping.ifsc_grievances_recorded}", 
        ifsc_grievances_resolved: "${mapping.ifsc_grievances_resolved}", 
        ifsc_induction_trainings: "${mapping.ifsc_induction_trainings}", 
        ifsc_leadership_trainings: "${mapping.ifsc_leadership_trainings}", 
        ifsc_mentor_meetings: "${mapping.ifsc_mentor_meetings}", 
        ifsc_refresher_trainings: "${mapping.ifsc_refresher_trainings}", 
        ifsc_research_trainings: "${mapping.ifsc_research_trainings}", 
        ifsc_scertmandated_trainings: "${
          mapping.ifsc_scertmandated_trainings
        }", 
        ifsc_teacher_attendance100: "${mapping.ifsc_teacher_attendance100}", 
        ifsc_teacher_attendance50: "${mapping.ifsc_teacher_attendance50}", 
        ifsc_tna: "${mapping.ifsc_tna}", 
        ifsc_tnabased_trainings: "${mapping.ifsc_tnabased_trainings}", 
        ifsc_trainings_actual: "${mapping.ifsc_trainings_actual}", 
        ifsc_trainings_planned: "${mapping.ifsc_trainings_planned}", 
        ifsc_unique_school_visits: "${mapping.ifsc_unique_school_visits}", 
        ifsc_upload_report: "", 
        instance_id: "${submission.instanceID}", 
        month: "${mapping.month}", 
        name: "${mapping.name}", 
        pm_leadershiptrainings_actual: "${
          mapping.pm_leadershiptrainings_actual
        }", 
        pm_leadershiptrainings_planned: "${
          mapping.pm_leadershiptrainings_planned
        }", 
        pm_trainings_actual: "${mapping.pm_trainings_actual}", 
        pm_trainings_planned: "${mapping.pm_trainings_planned}", 
        pm_upload_report: "", 
        pste_careercounsellingsessions: "${
          mapping.pste_careercounsellingsessions
        }", 
        pste_careercounsellingsessions_students: "${
          mapping.pste_careercounsellingsessions_students
        }", 
        pste_mentoringsessions: "${mapping.pste_mentoringsessions}", 
        pste_monitoringvisits: "${mapping.pste_monitoringvisits}", 
        pste_schools_sip: "${mapping.pste_schools_sip}", 
        pste_schoolscovered_mentalhealth: "${
          mapping.pste_schoolscovered_mentalhealth
        }", 
        pste_trainings_mentalhealth: "${mapping.pste_trainings_mentalhealth}", 
        pste_upload_report: "", 
        username: "${mapping.username}", 
        we_trainings_vocational_actual: "${
          mapping.we_trainings_vocational_actual
        }", 
        we_trainings_vocational_planned: "${
          mapping.we_trainings_vocational_planned
        }", 
        we_upload_report: "", 
        wingname: "${mapping.wingname}", 
        year: "${mapping.year}"
      }) {
        instance_id
      }
    }`;

    return this.appService.sendGqlRequest(gqlQuery);
  }
}
