
import numpy as np
from scipy.sparse import csr_matrix

class LogisticRegressionFromScratchSparse:
    
    # optimized for sparse TF-IDF matrices. Uses mini-batch gradient descent and sparse-friendly operations.

    def __init__(self, learning_rate=0.1, epochs=100, batch_size=256, verbose=True):
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.batch_size = batch_size
        self.verbose = verbose
        self.weights = None
        self.bias = None

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def fit(self, X, y):
        """
        X: csr_matrix or dense np.array
        y: numpy array of labels
        """
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0

        # Mini-batch gradient descent
        for epoch in range(self.epochs):
            # Shuffle indices
            indices = np.arange(n_samples)
            np.random.shuffle(indices)

            for start in range(0, n_samples, self.batch_size):
                end = min(start + self.batch_size, n_samples)
                batch_idx = indices[start:end]
                X_batch = X[batch_idx]
                y_batch = y[batch_idx]

                linear_model = X_batch.dot(self.weights) + self.bias
                y_pred = self.sigmoid(linear_model)

                error = y_pred - y_batch

                # Sparse-aware gradient
                if isinstance(X_batch, csr_matrix):
                    dw = X_batch.T.dot(error) / len(y_batch)
                else:
                    dw = np.dot(X_batch.T, error) / len(y_batch)

                db = np.sum(error) / len(y_batch)

                # Update weights
                self.weights -= self.learning_rate * dw
                self.bias -= self.learning_rate * db

            # Optional: print loss every 10 epochs
            if self.verbose and (epoch % 10 == 0 or epoch == self.epochs-1):
                linear_model_full = X.dot(self.weights) + self.bias
                y_pred_full = self.sigmoid(linear_model_full)
                loss = -np.mean(y * np.log(y_pred_full + 1e-15) + (1 - y) * np.log(1 - y_pred_full + 1e-15))
                print(f"Epoch {epoch+1}/{self.epochs}, Loss: {loss:.4f}")

    def predict_proba(self, X):
        linear_model = X.dot(self.weights) + self.bias
        return self.sigmoid(linear_model)

    def predict(self, X, threshold=0.5):
        proba = self.predict_proba(X)
        return (proba >= threshold).astype(int)
