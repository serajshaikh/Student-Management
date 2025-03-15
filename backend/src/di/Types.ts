
/**
 * @description InversifyJS Dependency Identifiers
 */
const TYPES = {
  StudentService: Symbol.for('StudentService'),
  StudentRepository: Symbol.for('StudentRepository'),
  StudentController: Symbol.for('StudentController'),
  ResponseHandler: Symbol.for('ResponseHandler'),
  Logger: Symbol.for('Logger'),
};

export { TYPES };