import torch.nn as nn


class DummyModel(nn.Module):
    def forward(self, x):
        return x


def load_swinir_model():
    model = DummyModel()
    device = "cpu"

    return model, device