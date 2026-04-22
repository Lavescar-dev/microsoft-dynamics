import { createBrowserRouter } from 'react-router';
import LandingPage from './pages/LandingPage';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import ContactEdit from './pages/ContactEdit';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import LeadEdit from './pages/LeadEdit';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import OpportunityEdit from './pages/OpportunityEdit';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import AccountEdit from './pages/AccountEdit';
import Sales from './pages/Sales';
import Marketing from './pages/Marketing';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import CampaignEdit from './pages/CampaignEdit';
import Segments from './pages/Segments';
import SegmentDetail from './pages/SegmentDetail';
import SegmentEdit from './pages/SegmentEdit';
import CustomerJourneys from './pages/CustomerJourneys';
import CustomerJourneyDetail from './pages/CustomerJourneyDetail';
import CustomerJourneyEdit from './pages/CustomerJourneyEdit';
import CustomerService from './pages/CustomerService';
import FieldService from './pages/FieldService';
import WorkOrders from './pages/WorkOrders';
import WorkOrderDetail from './pages/WorkOrderDetail';
import WorkOrderEdit from './pages/WorkOrderEdit';
import ScheduleBoard from './pages/ScheduleBoard';
import Finance from './pages/Finance';
import SupplyChain from './pages/SupplyChain';
import ProjectOperations from './pages/ProjectOperations';
import Commerce from './pages/Commerce';
import HumanResources from './pages/HumanResources';
import Activities from './pages/Activities';
import Quotes from './pages/Quotes';
import QuoteDetail from './pages/QuoteDetail';
import QuoteEdit from './pages/QuoteEdit';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import OrderEdit from './pages/OrderEdit';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import InvoiceEdit from './pages/InvoiceEdit';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductEdit from './pages/ProductEdit';
import Competitors from './pages/Competitors';
import CompetitorDetail from './pages/CompetitorDetail';
import CompetitorEdit from './pages/CompetitorEdit';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import CaseEdit from './pages/CaseEdit';
import KnowledgeArticles from './pages/KnowledgeArticles';
import KnowledgeArticleDetail from './pages/KnowledgeArticleDetail';
import KnowledgeArticleEdit from './pages/KnowledgeArticleEdit';
import Queues from './pages/Queues';
import QueueDetail from './pages/QueueDetail';
import QueueEdit from './pages/QueueEdit';
import ActivityDetail from './pages/ActivityDetail';
import ActivityEdit from './pages/ActivityEdit';
import CustomerInsights from './pages/CustomerInsights';
import BusinessCentral from './pages/BusinessCentral';
import Reports from './pages/Reports';
import Copilot from './pages/Copilot';
import Settings from './pages/Settings';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-4xl mb-2">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'dashboard', Component: Dashboard },
      { path: 'sales', Component: Sales },
      { path: 'leads', Component: Leads },
      { path: 'leads/new', Component: LeadEdit },
      { path: 'leads/:id', Component: LeadDetail },
      { path: 'leads/:id/edit', Component: LeadEdit },
      { path: 'opportunities', Component: Opportunities },
      { path: 'opportunities/new', Component: OpportunityEdit },
      { path: 'opportunities/:id', Component: OpportunityDetail },
      { path: 'opportunities/:id/edit', Component: OpportunityEdit },
      { path: 'accounts', Component: Accounts },
      { path: 'accounts/new', Component: AccountEdit },
      { path: 'accounts/:id', Component: AccountDetail },
      { path: 'accounts/:id/edit', Component: AccountEdit },
      { path: 'contacts', Component: Contacts },
      { path: 'contacts/new', Component: ContactEdit },
      { path: 'contacts/:id', Component: ContactDetail },
      { path: 'contacts/:id/edit', Component: ContactEdit },
      { path: 'marketing', Component: Marketing },
      { path: 'marketing/campaigns', Component: Campaigns },
      { path: 'marketing/campaigns/new', Component: CampaignEdit },
      { path: 'marketing/campaigns/:id', Component: CampaignDetail },
      { path: 'marketing/campaigns/:id/edit', Component: CampaignEdit },
      { path: 'marketing/segments', Component: Segments },
      { path: 'marketing/segments/new', Component: SegmentEdit },
      { path: 'marketing/segments/:id', Component: SegmentDetail },
      { path: 'marketing/segments/:id/edit', Component: SegmentEdit },
      { path: 'marketing/customer-journeys', Component: CustomerJourneys },
      { path: 'marketing/customer-journeys/new', Component: CustomerJourneyEdit },
      { path: 'marketing/customer-journeys/:id', Component: CustomerJourneyDetail },
      { path: 'marketing/customer-journeys/:id/edit', Component: CustomerJourneyEdit },
      { path: 'customer-service', Component: CustomerService },
      { path: 'field-service', Component: FieldService },
      { path: 'field-service/work-orders', Component: WorkOrders },
      { path: 'field-service/work-orders/new', Component: WorkOrderEdit },
      { path: 'field-service/work-orders/:id', Component: WorkOrderDetail },
      { path: 'field-service/work-orders/:id/edit', Component: WorkOrderEdit },
      { path: 'field-service/schedule-board', Component: ScheduleBoard },
      { path: 'finance', Component: Finance },
      { path: 'supply-chain', Component: SupplyChain },
      { path: 'project-operations', Component: ProjectOperations },
      { path: 'commerce', Component: Commerce },
      { path: 'human-resources', Component: HumanResources },
      { path: 'activities', Component: Activities },
      { path: 'activities/new', Component: ActivityEdit },
      { path: 'activities/:id', Component: ActivityDetail },
      { path: 'activities/:id/edit', Component: ActivityEdit },
      { path: 'quotes', Component: Quotes },
      { path: 'quotes/new', Component: QuoteEdit },
      { path: 'quotes/:id', Component: QuoteDetail },
      { path: 'quotes/:id/edit', Component: QuoteEdit },
      { path: 'orders', Component: Orders },
      { path: 'orders/new', Component: OrderEdit },
      { path: 'orders/:id', Component: OrderDetail },
      { path: 'orders/:id/edit', Component: OrderEdit },
      { path: 'invoices', Component: Invoices },
      { path: 'invoices/new', Component: InvoiceEdit },
      { path: 'invoices/:id', Component: InvoiceDetail },
      { path: 'invoices/:id/edit', Component: InvoiceEdit },
      { path: 'products', Component: Products },
      { path: 'products/new', Component: ProductEdit },
      { path: 'products/:id', Component: ProductDetail },
      { path: 'products/:id/edit', Component: ProductEdit },
      { path: 'competitors', Component: Competitors },
      { path: 'competitors/new', Component: CompetitorEdit },
      { path: 'competitors/:id', Component: CompetitorDetail },
      { path: 'competitors/:id/edit', Component: CompetitorEdit },
      { path: 'cases', Component: Cases },
      { path: 'cases/new', Component: CaseEdit },
      { path: 'cases/:id', Component: CaseDetail },
      { path: 'cases/:id/edit', Component: CaseEdit },
      { path: 'knowledge', Component: KnowledgeArticles },
      { path: 'knowledge/new', Component: KnowledgeArticleEdit },
      { path: 'knowledge/:id', Component: KnowledgeArticleDetail },
      { path: 'knowledge/:id/edit', Component: KnowledgeArticleEdit },
      { path: 'queues', Component: Queues },
      { path: 'queues/new', Component: QueueEdit },
      { path: 'queues/:id', Component: QueueDetail },
      { path: 'queues/:id/edit', Component: QueueEdit },
      { path: 'customer-insights', Component: CustomerInsights },
      { path: 'business-central', Component: BusinessCentral },
      { path: 'reports', Component: Reports },
      { path: 'copilot', Component: Copilot },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
]);
