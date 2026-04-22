import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Dismiss24Regular, Save24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import KnowledgeArticleDetail from './KnowledgeArticleDetail';

export default function KnowledgeArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-knowledge', []);

  if (!isNew) {
    return <KnowledgeArticleDetail />;
  }

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: 'You',
    views: 0,
    rating: 0,
    status: 'Draft',
    publishDate: new Date().toISOString().slice(0, 10),
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateArticle = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/knowledge/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Article Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Title" value={<EditableFieldControl value={formData.title} onChange={(value) => updateField('title', value)} />} />
            <FieldDisplay label="Category" value={<EditableFieldControl value={formData.category} onChange={(value) => updateField('category', value)} />} />
            <FieldDisplay label="Author" value={<EditableFieldControl value={formData.author} onChange={(value) => updateField('author', value)} />} />
            <FieldDisplay label="Views" value={<EditableFieldControl type="number" value={formData.views} onChange={(value) => updateField('views', Number(value))} />} />
            <FieldDisplay label="Rating" value={<EditableFieldControl type="number" value={formData.rating} onChange={(value) => updateField('rating', Number(value))} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Draft', 'Published', 'Archived']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Publish Date" value={<EditableFieldControl value={formData.publishDate} onChange={(value) => updateField('publishDate', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Knowledge Base', onClick: () => navigate('/knowledge') }, { label: 'New Article' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/knowledge')}>
          <Button variant="default" size="sm" onClick={handleCreateArticle}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/knowledge')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.title || 'New Article'} subtitle={formData.category || 'Create a new article'} icon="K" keyFields={[{ label: 'Status', value: formData.status }, { label: 'Author', value: formData.author }, { label: 'Views', value: formData.views }, { label: 'Rating', value: formData.rating }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
