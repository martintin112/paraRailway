function getInfoProcess() {
  return {
    versionNode: process.version,
    processId: process.pid,
    memory: process.memoryUsage(),
    argumentos: process.argv,
    carpeta: process.cwd(),
    sistemaOp: process.platform,
  };
}

module.exports = getInfoProcess;
