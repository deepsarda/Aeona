import { $log, PlatformLoggerSettings } from '@tsed/common';

$log.appenders.set('stdout', {
  type: 'stdout',
  levels: ['info', 'debug'],
  layout: {
    type: 'json',
  },
});

$log.appenders.set('stderr', {
  levels: ['trace', 'fatal', 'error', 'warn'],
  type: 'stderr',
  layout: {
    type: 'json',
  },
});

export default <PlatformLoggerSettings>{
  disableRoutesSummary: true,
  logRequest: false,
};
