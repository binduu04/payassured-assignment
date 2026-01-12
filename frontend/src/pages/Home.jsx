import { Link } from 'react-router-dom';
import { Users, FileText, TrendingUp, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Organize and manage client information in one place',
      link: '/clients',
      color: 'blue',
    },
    {
      icon: FileText,
      title: 'Recovery Cases',
      description: 'Track invoice recovery cases and follow-ups efficiently',
      link: '/cases',
      color: 'green',
    },
  ];

  const steps = [
    { icon: Users, text: 'Add your clients', color: 'blue' },
    { icon: FileText, text: 'Create recovery cases', color: 'purple' },
    { icon: Clock, text: 'Track follow-ups', color: 'yellow' },
    { icon: CheckCircle, text: 'Close successful cases', color: 'green' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Invoice Recovery Tracker
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Streamline your invoice recovery process with intelligent case management
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map(({ icon: Icon, title, description, link, color }) => (
          <Link
            key={link}
            to={link}
            className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-${color}-100 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center justify-between">
              {title}
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </h2>
            <p className="text-gray-600">
              {description}
            </p>
          </Link>
        ))}
      </div>

      {/* How it Works */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-gray-600">Simple steps to manage your recovery process</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map(({ icon: Icon, text, color }, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <p className="text-sm font-medium text-gray-900">{text}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white max-w-4xl mx-auto">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold mb-1">Getting Started</h3>
            <p className="text-blue-100">
              Begin by adding your clients to the system, then create recovery cases linked to them. 
              Track progress, update statuses, and manage follow-ups all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
