module.exports = ({name, version, author, repository}) => `
/*!
 * @author ${author}
 * @name ${name}
 * @version ${version}
 * ${repository ? `@see ${typeof repository === "object" ? repository.url : repository}` : ""}
 */
`;
