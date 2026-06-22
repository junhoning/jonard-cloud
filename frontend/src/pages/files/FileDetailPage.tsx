import { useNavigate, useParams } from 'react-router-dom'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { Button, EmptyState, useToast } from '@ingradient/ui/components'
import { Grid, Inline } from '@ingradient/ui/primitives'
import { ArrowLeft, Download } from 'lucide-react'
import { Field } from '../../components/Field'
import { StatusBadge } from '../../components/StatusBadge'
import { findFile } from '../../mock/files'

export function FileDetailPage() {
  const { fileId = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const file = findFile(fileId)

  if (!file) {
    return (
      <Panel>
        <EmptyState title="File not found" description={`No file with id ${fileId}.`} />
      </Panel>
    )
  }

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <Inline gap="var(--ig-space-4)" align="center">
              <PageTitle>{file.fileName}</PageTitle>
              <StatusBadge value={file.fileType} />
            </Inline>
            <PageSubtitle>File {file.id}</PageSubtitle>
          </PageTitleBlock>
          <Inline gap="var(--ig-space-4)">
            <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate('/files')}>
              Back
            </Button>
            <Button
              variant="solid"
              leadingIcon={<Download size={16} />}
              onClick={() => toast('Download is not available in this mockup.', { tone: 'info' })}
            >
              Download
            </Button>
          </Inline>
        </PageHeaderRow>
      </PageHeader>

      <Panel style={{ padding: 'var(--ig-space-8)' }}>
        <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
          <Field label="File name" value={file.fileName} />
          <Field label="Type">
            <StatusBadge value={file.fileType} />
          </Field>
          <Field label="Device">
            {file.deviceId ? (
              <Button variant="secondary" size="sm" onClick={() => navigate(`/devices/${file.deviceId}`)}>
                {file.deviceName}
              </Button>
            ) : (
              '—'
            )}
          </Field>
          <Field label="Device model" value={file.deviceModel} />
          <Field label="Serial number" value={file.serialNumber} />
          <Field label="Uploaded by" value={file.register} />
          <Field label="Created" value={file.registDate} />
        </Grid>
      </Panel>
    </>
  )
}
