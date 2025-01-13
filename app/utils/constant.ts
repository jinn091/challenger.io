export const WebHackingMethods = {
	XSS: "Cross-Site Scripting (Injecting malicious scripts into web pages)",
	SQL_INJECTION:
		"SQL Injection (Exploiting vulnerabilities in database queries)",
	CSRF: "Cross-Site Request Forgery (Exploiting trusted sessions for unauthorized actions)",
	SSRF: "Server-Side Request Forgery (Forcing a server to make unintended requests)",
	DIRECTORY_TRAVERSAL:
		"Accessing restricted directories and files on the web server",
	AUTHENTICATION_BYPASS:
		"Circumventing authentication mechanisms on web applications",
	SESSION_HIJACKING:
		"Taking over active user sessions to gain unauthorized access",
	SUBDOMAIN_ENUMERATION:
		"Identifying vulnerabilities in subdomains of a website",
	API_SECURITY: "Testing for vulnerabilities in web application APIs",
	OPEN_REDIRECT:
		"Redirecting users to malicious sites via open redirect vulnerabilities",
	CLICKJACKING:
		"Tricking users into clicking on hidden elements within a web page",
	FILE_UPLOAD_VULNERABILITY:
		"Exploiting poorly secured file upload functionalities",
	CONTENT_SECURITY_POLICY_BYPASS:
		"Bypassing CSP to execute unauthorized actions",
	BROKEN_ACCESS_CONTROL:
		"Exploiting flaws in access control to gain unauthorized privileges",
	INSECURE_DESERIALIZATION:
		"Exploiting deserialization processes to execute malicious actions",
	BROKEN_AUTHENTICATION:
		"Exploiting authentication flaws to impersonate users",
	SENSITIVE_DATA_EXPOSURE: "Discovering and exploiting sensitive data leaks",
	WEAK_SESSION_MANAGEMENT:
		"Exploiting session-related weaknesses (e.g., session fixation)",
	PATH_PARAMETER_ATTACKS:
		"Manipulating path parameters to access unauthorized resources",
	HTTP_REQUEST_SMUGGLING:
		"Manipulating HTTP requests to exploit web servers and proxies",
	BUSINESS_LOGIC_BUGS:
		"Exploiting flaws in the logical flow of web applications",
	HOST_HEADER_INJECTION:
		"Manipulating HTTP headers to exploit trust relationships",
	HTTP_RESPONSE_SPLITTING:
		"Injecting data into HTTP responses to create malicious outputs",
	CACHE_POISONING:
		"Manipulating server caches to deliver malicious content to users",
	DOM_BASED_XSS:
		"Exploiting client-side JavaScript to manipulate the DOM for malicious purposes",
	CORS_MISCONFIGURATION:
		"Exploiting Cross-Origin Resource Sharing to access restricted data",
	IDOR: "Insecure Direct Object References (Accessing unauthorized objects directly)",
	HTML_INJECTION: "Injecting malicious HTML into web pages",
	XML_EXTERNAL_ENTITY:
		"Exploiting vulnerable XML parsers to access restricted resources",
	HIDDEN_PARAMETER_DISCOVERY:
		"Identifying and exploiting hidden parameters in web requests",
	INPUT_VALIDATION_BUGS:
		"Exploiting insufficient input validation in forms or APIs",
	CROSS_ORIGIN_SCRIPTING: "Exploiting insecure interactions between origins",
	TEMPLATE_INJECTION: "Injecting malicious code into server-side templates",
	MISCONFIGURED_SECURITY_HEADERS:
		"Exploiting missing or misconfigured HTTP security headers",
	RATE_LIMITING_BYPASS:
		"Circumventing rate-limiting protections for brute force or scraping",
	PASSWORD_RESET_POISONING:
		"Manipulating password reset flows to compromise accounts",
	WEBSOCKET_SECURITY: "Testing for vulnerabilities in WebSocket connections",
	WEAK_ENCRYPTION:
		"Exploiting insecure cryptographic implementations on websites",
	DEPENDENCY_VULNERABILITIES:
		"Identifying outdated or vulnerable third-party libraries in use",
	JAVASCRIPT_PROTOTYPE_POLLUTION:
		"Manipulating JavaScript objects to exploit server-side logic"
};

export type WebHackingMethods = keyof typeof WebHackingMethods;

export const SocialMedias = {
	Facebook: "facebook",
	Telegram: "telegram",
	Reddit: "reddit",
	LinkedIn: "linkedin",
	Github: "github"
};

export const DRAG_SQUARE_HALF_SIZE = 10;
