import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Edit24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockKnowledgeArticles } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { usePersistentState } from '../components/form/usePersistentState';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';

function getArticleStatusClass(status: string) {
  if (status === 'Published') return 'bg-green-100 text-green-700';
  if (status === 'Draft') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
}

export default function KnowledgeArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: articles, removeItem } = usePersistentCollection('dynamics-collection-knowledge', mockKnowledgeArticles);
  const baseArticle = articles.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [article, setArticle] = usePersistentState(`dynamics-record-knowledge-${id}`, baseArticle);
  const [draftArticle, setDraftArticle] = useState(baseArticle);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-4">The requested article does not exist.</p>
          <Button onClick={() => navigate('/knowledge')}>Back to Knowledge Base</Button>
        </div>
      </div>
    );
  }

  const activeArticle = isEditing && draftArticle ? draftArticle : article;

  const updateDraftArticle = <K extends keyof typeof article>(key: K, value: (typeof article)[K]) => {
    setDraftArticle((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [articleTimelineEntries, setArticleTimelineEntries] = usePersistentState(
    `dynamics-timeline-knowledge-${id}`,
    [
      {
        id: `knowledge-${article.id}-created`,
        title: `${article.title} published to knowledge base`,
        type: 'Note',
        status: 'Completed',
        date: new Date(article.publishDate).toLocaleDateString(),
        owner: article.author,
        regarding: article.category,
      },
    ]
  );

  const handleSaveArticle = () => {
    if (!draftArticle) return;
    setArticle(draftArticle);
    setIsEditing(false);
    setIsDirty(false);
    setArticleTimelineEntries((current) => [
      {
        id: `knowledge-save-${Date.now()}`,
        title: 'Knowledge article updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftArticle.author,
        regarding: draftArticle.title,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseArticle = () => {
    handleSaveArticle();
    navigate('/knowledge');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Article Information">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this article." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Category" value={activeArticle.category} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getArticleStatusClass(activeArticle.status)}`}>{activeArticle.status}</span>} />
              <FieldDisplay label="Author" value={activeArticle.author} />
              <FieldDisplay label="Views" value={activeArticle.views.toLocaleString()} />
              <FieldDisplay label="Rating" value={activeArticle.rating.toFixed(1)} />
              <FieldDisplay label="Publish Date" value={new Date(activeArticle.publishDate).toLocaleDateString()} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Article Timeline"
              entries={articleTimelineEntries}
              emptyLabel="No article updates recorded"
              onCreateEntry={(type, title) =>
                setArticleTimelineEntries((current) => [
                  {
                    id: `knowledge-${activeArticle.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeArticle.author,
                    regarding: activeArticle.title,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setArticleTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
              }
            />
          </FormSection>
        </>
      ),
    },
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Article Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Article ID" value={<span className="text-gray-600 text-sm">{activeArticle.id}</span>} />
            <FieldDisplay label="Title" value={isEditing ? <EditableFieldControl value={draftArticle?.title ?? ''} onChange={(value) => updateDraftArticle('title', value)} /> : activeArticle.title} />
            <FieldDisplay label="Category" value={isEditing ? <EditableFieldControl value={draftArticle?.category ?? ''} onChange={(value) => updateDraftArticle('category', value)} /> : activeArticle.category} />
            <FieldDisplay label="Author" value={isEditing ? <EditableFieldControl value={draftArticle?.author ?? ''} onChange={(value) => updateDraftArticle('author', value)} /> : activeArticle.author} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftArticle?.status ?? 'Published'} options={['Published', 'Draft', 'Archived']} onChange={(value) => updateDraftArticle('status', value as typeof article.status)} /> : activeArticle.status} />
            <FieldDisplay label="Views" value={isEditing ? <EditableFieldControl type="number" value={draftArticle?.views ?? 0} onChange={(value) => updateDraftArticle('views', Number(value))} /> : activeArticle.views.toLocaleString()} />
            <FieldDisplay label="Rating" value={isEditing ? <EditableFieldControl type="number" value={draftArticle?.rating ?? 0} onChange={(value) => updateDraftArticle('rating', Number(value))} /> : activeArticle.rating.toFixed(1)} />
            <FieldDisplay label="Publish Date" value={isEditing ? <EditableFieldControl value={draftArticle?.publishDate ?? ''} onChange={(value) => updateDraftArticle('publishDate', value)} /> : new Date(activeArticle.publishDate).toLocaleDateString()} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Knowledge Base', onClick: () => navigate('/knowledge') }, { label: activeArticle.title }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/knowledge')}
            entityType="knowledge"
            entityId={activeArticle.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveArticle}
            onSaveAndClose={handleSaveAndCloseArticle}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeArticle.id,
                entityType: 'knowledge',
                entity: activeArticle,
                onPatchEntity: (patch) => setArticle((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setArticleTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => {
                if (isEditing) {
                  setDraftArticle(article);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }

                setDraftArticle(article);
                setIsEditing(true);
              }}
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={
          <FormHeader
            title={activeArticle.title}
            subtitle={activeArticle.category}
            icon={activeArticle.title[0]}
            badges={[{ label: activeArticle.status, className: `px-3 py-1 rounded-full text-sm ${getArticleStatusClass(activeArticle.status)}` }]}
            keyFields={[
              { label: 'Author', value: activeArticle.author },
              { label: 'Views', value: activeArticle.views.toLocaleString() },
              { label: 'Rating', value: activeArticle.rating.toFixed(1) },
              { label: 'Published', value: new Date(activeArticle.publishDate).toLocaleDateString() },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Article</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete this article? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeItem(activeArticle.id);
                    window.localStorage.removeItem(`dynamics-record-knowledge-${activeArticle.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-knowledge-${activeArticle.id}`);
                    navigate('/knowledge');
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
