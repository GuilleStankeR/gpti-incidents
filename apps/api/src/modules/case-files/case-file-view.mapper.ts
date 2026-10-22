import type { AuditEntry, Evidence, User } from '@prisma/client';

import { formatDateTime } from '@incidents/shared';
import type { IncidentStatus } from '@incidents/shared';

import { caseFilesCopy } from './case-files.copy';
import type { CaseFileEntity } from './case-files.repository';
import type {
  CaseFileAuditEntryView,
  CaseFileEvidenceView,
  CaseFileField,
  CaseFileView,
} from './pdf/case-file-view';
import type { PdfImage } from './pdf/pdf-image';

const BYTES_PER_KILOBYTE = 1024;
const KILOBYTE_DECIMALS = 1;

export interface CaseFileSource {
  readonly incident: CaseFileEntity;
  readonly images: readonly (PdfImage | null)[];
  readonly issuerName: string;
  readonly issuedAt: Date;
  readonly timeZone: string;
}

const { fields, values, evidenceDetails } = caseFilesCopy;

function describeStatus(status: IncidentStatus | null): string {
  return status === null ? values.initialStatus : caseFilesCopy.statusLabels[status];
}

function describePerson(person: Pick<User, 'name' | 'role'>): string {
  return values.personWithRole(person.name, caseFilesCopy.roleLabels[person.role]);
}

function formatFileSize(bytes: number): string {
  return values.fileSizeInKilobytes((bytes / BYTES_PER_KILOBYTE).toFixed(KILOBYTE_DECIMALS));
}

function buildLocationFields(incident: CaseFileEntity): CaseFileField[] {
  const locationFields: CaseFileField[] = [];

  if (incident.latitude !== null && incident.longitude !== null) {
    const coordinates = values.coordinates(
      incident.latitude.toString(),
      incident.longitude.toString(),
    );
    locationFields.push({ label: fields.coordinates, value: coordinates });
  }

  if (incident.geocodedAddress !== null) {
    locationFields.push({ label: fields.geocodedAddress, value: incident.geocodedAddress });
  }

  return locationFields;
}

function buildIdentificationFields(incident: CaseFileEntity, timeZone: string): CaseFileField[] {
  const formatDate = (date: Date): string => formatDateTime(date, timeZone);
  const closedFields =
    incident.closedAt === null
      ? []
      : [{ label: fields.closedAt, value: formatDate(incident.closedAt) }];

  return [
    { label: fields.category, value: incident.category.name },
    { label: fields.location, value: incident.location },
    { label: fields.status, value: describeStatus(incident.status) },
    { label: fields.occurredAt, value: formatDate(incident.occurredAt) },
    { label: fields.reportedAt, value: formatDate(incident.reportedAt) },
    {
      label: fields.dueAt,
      value: values.dueAtWithSla(formatDate(incident.dueAt), incident.category.slaHours),
    },
    ...closedFields,
    ...buildLocationFields(incident),
  ];
}

function buildPartyFields(incident: CaseFileEntity): CaseFileField[] {
  return [
    { label: fields.reporter, value: describePerson(incident.reporter) },
    {
      label: fields.assignee,
      value: incident.assignee === null ? values.notAssigned : describePerson(incident.assignee),
    },
  ];
}

function buildEvidenceView(
  evidence: Evidence & { readonly uploadedBy: User },
  image: PdfImage | null,
  timeZone: string,
): CaseFileEvidenceView {
  return {
    image,
    details: [
      evidenceDetails.originalName(evidence.originalName),
      evidenceDetails.uploadedAt(formatDateTime(evidence.createdAt, timeZone)),
      evidenceDetails.uploadedBy(evidence.uploadedBy.name),
      evidenceDetails.size(formatFileSize(evidence.sizeBytes)),
      evidenceDetails.sha256(evidence.sha256),
    ],
  };
}

function buildAuditEntryView(
  entry: AuditEntry & { readonly user: User },
  timeZone: string,
): CaseFileAuditEntryView {
  return {
    heading: caseFilesCopy.auditEntryHeading(
      formatDateTime(entry.createdAt, timeZone),
      entry.user.name,
      caseFilesCopy.roleLabels[entry.user.role],
    ),
    fromLabel: describeStatus(entry.fromStatus),
    toLabel: describeStatus(entry.toStatus),
    note: entry.note,
  };
}

export function toCaseFileView(source: CaseFileSource): CaseFileView {
  const { incident, images, timeZone } = source;

  return {
    folio: incident.folio,
    condominiumName: incident.condominium.name,
    condominiumAddress: incident.condominium.address,
    identification: buildIdentificationFields(incident, timeZone),
    parties: buildPartyFields(incident),
    description: incident.description,
    evidence: incident.evidence.map((evidence, index) =>
      buildEvidenceView(evidence, images[index] ?? null, timeZone),
    ),
    auditTrail: incident.auditTrail.map((entry) => buildAuditEntryView(entry, timeZone)),
    issuedLine: caseFilesCopy.footer.issued(
      formatDateTime(source.issuedAt, timeZone),
      source.issuerName,
      incident.folio,
    ),
  };
}
