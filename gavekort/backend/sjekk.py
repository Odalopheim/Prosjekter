from flask import Blueprint, jsonify

from models import Gavekort


sjekk_bp = Blueprint("sjekk_bp", __name__)


@sjekk_bp.route("/gavekort/<int:id>", methods=["GET"])
def hent_gavekort(id):
	gavekort = Gavekort.query.get_or_404(id)
	return jsonify({
		"id": gavekort.id,
		"belop": gavekort.belop,
		"brukt": gavekort.brukt,
		"igjen": gavekort.igjen
	})
