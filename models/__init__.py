# -*- coding: utf-8 -*-
"""
Models available to the Outbreak Explorer web application

"""
import datetime

from .model import BaileyPikeModel, AgentFactory
from .agent import Denizen, DenizenAgent


__all__ = ["AgentFactory", "DenizenAgent"]

__title__ = "Outbreak Explorer Models"
__version__ = ""
__license__ = ""
__copyright__ = "Copyright %s Outbreak Explorer Team" % datetime.date.today().year
