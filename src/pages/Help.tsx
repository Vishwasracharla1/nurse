import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HelpCircle, Book, MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';

export function Help() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const quickStarts = [
    {
      role: 'Nurse',
      steps: [
        'View your assigned tasks on the department task board',
        'Monitor patient alerts from VitalGuard and MediCheck',
        'Complete documentation with DocuNurse assistance',
        'Access patient education materials',
      ]
    },
    {
      role: 'Charge Nurse',
      steps: [
        'Review team KPIs on the dashboard',
        'Coordinate shift handoffs with Bridge',
        'Monitor compliance heatmap',
        'Approve discharge plans and critical actions',
      ]
    },
    {
      role: 'Admin',
      steps: [
        'Set organizational OKRs and align with KPIs',
        'Configure data sources and agent settings',
        'Review ROI metrics and cost savings',
        'Manage compliance standards and evidence trails',
      ]
    }
  ];

  const faqs = [
    {
      id: 'bcma',
      question: 'What is BCMA?',
      answer: 'Bar Code Medication Administration (BCMA) is a safety technology that uses barcodes to verify the right patient receives the right medication at the right dose, route, and time. MediCheck automates BCMA verification.'
    },
    {
      id: 'isbar',
      question: 'What is ISBAR?',
      answer: 'ISBAR (Identify, Situation, Background, Assessment, Recommendation) is a structured communication framework for clinical handoffs. Bridge agent facilitates ISBAR-compliant handoffs between shifts and departments.'
    },
    {
      id: 'aldrete',
      question: 'What is the Aldrete Score?',
      answer: 'The Aldrete Score is a post-anesthesia recovery scoring system (0-10) assessing activity, respiration, circulation, consciousness, and oxygen saturation. PACUGuard automates Aldrete scoring for PACU readiness.'
    },
    {
      id: 'esi',
      question: 'What is ESI Triage?',
      answer: 'Emergency Severity Index (ESI) is a 5-level triage system (1=most urgent, 5=least urgent) based on acuity and resource needs. TriageMate provides automated ESI scoring.'
    },
    {
      id: 'lwbs',
      question: 'What does LWBS mean?',
      answer: 'Left Without Being Seen (LWBS) refers to ED patients who leave before medical evaluation. Watchtower predicts LWBS risk and triggers mitigation protocols.'
    },
  ];

  const glossary = [
    { term: 'DH', definition: 'Digital Human - AI agent performing automated clinical workflows' },
    { term: 'OH', definition: 'Operational Human - Clinical staff working alongside AI agents' },
    { term: 'WHO Checklist', definition: 'World Health Organization Surgical Safety Checklist for OR procedures' },
    { term: 'JCI', definition: 'Joint Commission International - global healthcare accreditation body' },
    { term: 'NABH', definition: 'National Accreditation Board for Hospitals - Indian healthcare standards' },
    { term: 'DHA', definition: 'Dubai Health Authority - UAE healthcare regulations' },
    { term: 'MOHAP', definition: 'Ministry of Health and Prevention - UAE federal health standards' },
    { term: 'HL7', definition: 'Health Level Seven - interoperability standards for healthcare data exchange' },
    { term: 'FHIR', definition: 'Fast Healthcare Interoperability Resources - modern healthcare data standard' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-gray-600">Guides, FAQs, and resources for using Mobius AI</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStarts.map((guide) => (
            <Card key={guide.role}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Book size={20} className="text-teal-600" />
                  <CardTitle>{guide.role}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {guide.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <HelpCircle size={18} className="text-teal-600" />
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <p className="mt-3 text-sm text-gray-700 pl-6">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Glossary</h2>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {glossary.map((item) => (
                <div key={item.term} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="info">{item.term}</Badge>
                  </div>
                  <p className="text-sm text-gray-700">{item.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageCircle size={24} className="text-teal-600" />
            <CardTitle>Contact Support</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Need additional assistance? Our support team is available 24/7.
            </p>
            <div className="flex space-x-4">
              <div className="flex-1 p-4 bg-teal-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-1">Email</div>
                <a href="mailto:support@mobius-ai.health" className="text-teal-600 hover:text-teal-700">
                  support@mobius-ai.health
                </a>
              </div>
              <div className="flex-1 p-4 bg-teal-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-1">Phone</div>
                <a href="tel:+18005551234" className="text-teal-600 hover:text-teal-700">
                  +1 (800) 555-1234
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
