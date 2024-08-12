import express from 'express';
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
	res.json({
		message: 'Koyeb health check!',
	});
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
