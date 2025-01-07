package com.location.service;

import com.location.repository.StatisticsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Override
    public double getTotalIncome() {
        return statisticsRepository.getTotalIncome();
    }

    @Override
    public int getReservations() {
        return statisticsRepository.getReservations();
    }

    @Override
    public int getAvailableVehicles() {
        return statisticsRepository.getAvailableVehicles();
    }

    @Override
    public double getOccupancyRate() {
        return statisticsRepository.getOccupancyRate();
    }

    @Override
    public List<Map<String, Object>> getIncomeByMonth() {
        return statisticsRepository.getIncomeByMonth();
    }

    @Override
    public List<Map<String, Object>> getVehicleRotation() {
        return statisticsRepository.getVehicleRotation();
    }
}
