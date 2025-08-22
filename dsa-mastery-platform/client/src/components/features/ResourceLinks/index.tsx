import { Resource } from '@/types';

interface ResourceLinksProps {
  resources: Resource[];
}

export default function ResourceLinks({ resources }: ResourceLinksProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No resources available for this topic yet.
        </p>
      </div>
    );
  }

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📄';
      case 'book':
        return '📚';
      case 'course':
        return '🎓';
      default:
        return '🔗';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Learning Resources
      </h3>
      <div className="grid gap-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h4>
                  {resource.isPremium && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                {resource.author && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {resource.author}
                  </p>
                )}
                {resource.duration && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Duration: {resource.duration} minutes
                  </p>
                )}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Open
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
