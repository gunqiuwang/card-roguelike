import { runSimulation } from './simulationRunner';

const report = runSimulation();
console.log('=== Simulation Report ===');
console.log(JSON.stringify(report, null, 2));
console.log('========================');